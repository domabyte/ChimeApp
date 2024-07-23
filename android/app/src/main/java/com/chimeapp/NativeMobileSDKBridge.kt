package com.chimeapp;

import android.Manifest
import android.annotation.TargetApi
import android.app.Activity
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.media.projection.MediaProjectionManager
import android.os.Handler
import android.os.IBinder
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewModelStoreOwner
import com.amazonaws.services.chime.sdk.meetings.audiovideo.AudioVideoFacade
import com.amazonaws.services.chime.sdk.meetings.device.MediaDeviceType
import com.amazonaws.services.chime.sdk.meetings.audiovideo.contentshare.ContentShareObserver
import com.amazonaws.services.chime.sdk.meetings.audiovideo.contentshare.ContentShareStatus
import com.amazonaws.services.chime.sdk.meetings.audiovideo.video.capture.*
import com.amazonaws.services.chime.sdk.meetings.audiovideo.video.gl.DefaultEglCoreFactory
import com.amazonaws.services.chime.sdk.meetings.audiovideo.video.gl.EglCoreFactory
import com.amazonaws.services.chime.sdk.meetings.session.*
import com.amazonaws.services.chime.sdk.meetings.utils.logger.ConsoleLogger
import com.amazonaws.services.chime.sdk.meetings.utils.logger.LogLevel
import com.chimeapp.RNEventEmitter.Companion.RN_EVENT_ERROR
import com.chimeapp.RNEventEmitter.Companion.RN_EVENT_MEETING_END
import com.chimeapp.RNEventEmitter.Companion.RN_EVENT_KEY_VIDEO_IS_SCREEN_SHARE
import com.chimeapp.device.ScreenShareManager
import com.chimeapp.service.ScreenCaptureService
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener


class NativeMobileSDKBridge(
        reactContext: ReactApplicationContext,
        private val eventEmitter: RNEventEmitter,
        private val meetingObservers: MeetingObservers) : ReactContextBaseJavaModule(reactContext) ,PermissionListener, ViewModelStoreOwner, ContentShareObserver {

    private val reContext: ReactApplicationContext? = reactContext
    private var isBound: Boolean = false
    private var screenShareManager: ScreenShareManager? = null
    private var screenshareServiceConnection: ServiceConnection? = null
    val eglCoreFactory: EglCoreFactory = DefaultEglCoreFactory() // does this needs to be initialize if yes to what should it be initialize
    companion object {
        private const val WEBRTC_PERMISSION_REQUEST_CODE = 1
        private const val TAG = "ChimeReactNativeSDKDemoManager"
        private const val KEY_MEETING_ID = "MeetingId"
        private const val KEY_ATTENDEE_ID = "AttendeeId"
        private const val KEY_JOIN_TOKEN = "JoinToken"
        private const val KEY_EXTERNAL_ID = "ExternalUserId"
        private const val KEY_MEDIA_PLACEMENT = "MediaPlacement"
        private const val KEY_AUDIO_FALLBACK_URL = "AudioFallbackUrl"
        private const val KEY_AUDIO_HOST_URL = "AudioHostUrl"
        private const val KEY_TURN_CONTROL_URL = "TurnControlUrl"
        private const val KEY_SIGNALING_URL = "SignalingUrl"
        private const val TOPIC_CHAT = "chat"

        var meetingSession: MeetingSession? = null
    }

    private val logger = ConsoleLogger(LogLevel.DEBUG)

    private val webRtcPermissionPermission = arrayOf(
            Manifest.permission.MODIFY_AUDIO_SETTINGS,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CAMERA, Manifest.permission.FOREGROUND_SERVICE,
    )
    private val SCREEN_CAPTURE_REQUEST_CODE = 1



    override fun getName(): String {
        return "NativeMobileSDKBridge"
    }

    @ReactMethod
    fun startScreenShare(isScreenShared: Boolean) {
        val mediaProjectionManager = currentActivity?.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        // Show prompt for screen capture permission
        currentActivity?.startActivityForResult(
                mediaProjectionManager.createScreenCaptureIntent(),
                SCREEN_CAPTURE_REQUEST_CODE
        )


    }

    // GET ACTIVTY RESULT HERE
    private val mActivityEventListener: ActivityEventListener =
            object : BaseActivityEventListener() {
                override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {

                    if (SCREEN_CAPTURE_REQUEST_CODE == requestCode) {

                        logger.info("#############", "Code has reached here")
                        if (resultCode != Activity.RESULT_OK) {
                            Toast.makeText(currentActivity!!.applicationContext, "Screen share cannot work without permissions", Toast.LENGTH_LONG).show()

                        } else {
                            Toast.makeText(currentActivity!!.applicationContext, "PERMISSION GRANTED", Toast.LENGTH_LONG).show()                 
                            data?.let { startScreenShare(resultCode, it, currentActivity!!) }
                           eventEmitter.sendReactNativeEvent(RN_EVENT_KEY_VIDEO_IS_SCREEN_SHARE, null)
                        }
                    }
                }
            }

    private fun startScreenShare(resultCode: Int, data: Intent, context: Context) {
        currentActivity!!.startService(Intent(currentActivity, ScreenCaptureService::class.java))
        screenshareServiceConnection = object : ServiceConnection {
            override fun onServiceConnected(className: ComponentName, service: IBinder) {

                val screenCaptureSource = DefaultScreenCaptureSource(
                        context,
                        logger,
                        DefaultSurfaceTextureCaptureSourceFactory(
                                logger,
                                eglCoreFactory
                        ),
                        resultCode,
                        data
                )
        

                val screenCaptureSourceObserver = object : CaptureSourceObserver {
                    override fun onCaptureStarted() {
                        logger.info("#############", "Screen CApture has started")
                        logger.info("#############", "Screen CApture has started")
                        logger.info("#############", "Screen CApture has started")
                        logger.info("#############", "Screen CApture has started")
                        screenShareManager?.let { source ->
                            val audioVideo: AudioVideoFacade = meetingSession!!.audioVideo
                            audioVideo.startContentShare(source)
                        }
                    }

                    override fun onCaptureStopped() {
//                        notifyHandler("Screen capture stopped")
                    }

                    override fun onCaptureFailed(error: CaptureSourceError) {
//                        notifyHandler("Screen capture failed with error $error")
                        meetingSession?.audioVideo?.stopContentShare()
                    }
                     }


                            screenShareManager = ScreenShareManager(screenCaptureSource, context)
                            screenShareManager?.screenCaptureConnectionService = screenshareServiceConnection
                            screenShareManager?.addObserver(screenCaptureSourceObserver)
                            screenShareManager?.start()
                            logger.info("#############", "Screen screenShareManager has started")

            }

            override fun onServiceDisconnected(arg0: ComponentName) {
                isBound = false
            }
        }

        context.startService(
                Intent(
                        context,
                        ScreenCaptureService::class.java
                ).also { intent ->
                    screenshareServiceConnection?.let {
                        context?.bindService(
                                intent,
                                it,
                                Context.BIND_AUTO_CREATE
                        )
                    }
                })
    }

    init {
    reContext?.addActivityEventListener(mActivityEventListener)
}

    @ReactMethod
    fun startMeeting(meetingInfo: ReadableMap, attendeeInfo: ReadableMap) {
        logger.info(TAG, "Called startMeeting")
        logger.info("####################", attendeeInfo.toString())
        currentActivity?.let { activity ->
            if (meetingSession != null) {
                meetingSession?.audioVideo?.stop()
                meetingSession = null
            }

            try {
                val sessionConfig = createSessionConfiguration(meetingInfo, attendeeInfo)
                val meetingSession = sessionConfig?.let {
                    DefaultMeetingSession(
                            it,
                            logger,
                            activity.applicationContext
                    )
                }

                if (meetingSession != null) {
                    NativeMobileSDKBridge.meetingSession = meetingSession

                    if (!hasPermissionsAlready()) {
                        val permissionAwareActivity = activity as PermissionAwareActivity
                        permissionAwareActivity.requestPermissions(webRtcPermissionPermission, WEBRTC_PERMISSION_REQUEST_CODE, this)
                        return
                    }

                    startAudioVideo()
                } else {
                    logger.error(TAG, "Failed to create meeting session")
                    eventEmitter.sendReactNativeEvent(RN_EVENT_ERROR, "Failed to create meeting session")
                }
            } catch (exception: Exception) {
                logger.error(TAG, "Error starting the meeting session: ${exception.localizedMessage}")
                eventEmitter.sendReactNativeEvent(RN_EVENT_ERROR, "Error starting the meeting session: ${exception.localizedMessage}")
                return
            }
        }
    }

    private fun hasPermissionsAlready(): Boolean {
        return currentActivity?.let { activity ->
            webRtcPermissionPermission.all {
                ContextCompat.checkSelfPermission(activity, it) == PackageManager.PERMISSION_GRANTED
            }
        } ?: false
    }

    private fun startAudioVideo() {
        meetingSession?.let {
            it.audioVideo.addRealtimeObserver(meetingObservers)
            it.audioVideo.addVideoTileObserver(meetingObservers)
            it.audioVideo.addAudioVideoObserver(meetingObservers)
            it.audioVideo.addRealtimeDataMessageObserver(TOPIC_CHAT, meetingObservers)
            it.audioVideo.start()
            it.audioVideo.startRemoteVideo()
        }
    }

    private fun createSessionConfiguration(meetingInfo: ReadableMap, attendeeInfo: ReadableMap): MeetingSessionConfiguration? {
        return try {
            val meetingId = meetingInfo.getString(KEY_MEETING_ID) ?: ""
            val attendeeId = attendeeInfo.getString(KEY_ATTENDEE_ID) ?: ""
            val joinToken = attendeeInfo.getString(KEY_JOIN_TOKEN) ?: ""
            val externalUserId = attendeeInfo.getString(KEY_EXTERNAL_ID) ?: ""
            var audioFallbackUrl = ""
            var audioHostUrl = ""
            var turnControlUrl = ""
            var signalingUrl = ""

            meetingInfo.getMap(KEY_MEDIA_PLACEMENT)?.let {
                logger.info(TAG, it.toString())
                audioFallbackUrl = it.getString(KEY_AUDIO_FALLBACK_URL) ?: ""
                audioHostUrl = it.getString(KEY_AUDIO_HOST_URL) ?: ""
                turnControlUrl = it.getString(KEY_TURN_CONTROL_URL) ?: ""
                signalingUrl = it.getString(KEY_SIGNALING_URL) ?: ""
            }

            MeetingSessionConfiguration(meetingId,
                    MeetingSessionCredentials(attendeeId, externalUserId, joinToken),
                    MeetingSessionURLs(audioFallbackUrl, audioHostUrl, turnControlUrl, signalingUrl, ::defaultUrlRewriter))
        } catch (exception: Exception) {
            logger.error(TAG, "Error creating session configuration: ${exception.localizedMessage}")
            eventEmitter.sendReactNativeEvent(RN_EVENT_ERROR, "Error creating session configuration: ${exception.localizedMessage}")
            null
        }
    }

    @ReactMethod
    fun stopMeeting() {
        logger.info(TAG, "Called stopMeeting")

        meetingSession?.audioVideo?.stop()
        eventEmitter.sendReactNativeEvent(RN_EVENT_MEETING_END, null)
    }

    @ReactMethod
    fun setMute(isMute: Boolean) {
        logger.info(TAG, "Called setMute: $isMute")

        if (isMute) {
            meetingSession?.audioVideo?.realtimeLocalMute()
        } else {
            meetingSession?.audioVideo?.realtimeLocalUnmute()
        }
    }

    @ReactMethod
    fun setCameraOn(enabled: Boolean) {
        logger.info(TAG, "Called setCameraOn: $enabled")

        if (enabled) {
            meetingSession?.audioVideo?.startLocalVideo()
        } else {
            meetingSession?.audioVideo?.stopLocalVideo()
        }
    }

    @ReactMethod
    fun bindVideoView(viewIdentifier: Double, tileId: Int) {
        logger.info(TAG, "Called bindVideoView for tileId: $tileId with identifier: $viewIdentifier")
    }

    @ReactMethod
    fun unbindVideoView(tileId: Int) {
        logger.info(TAG, "Called unbindVideoView for tileId: $tileId")

        meetingSession?.run {
            audioVideo.unbindVideoView(tileId)
        }
    }

    @ReactMethod
    fun sendDataMessage(topic: String, message: String, lifetimeMs: Int) {
        meetingSession?.audioVideo?.realtimeSendDataMessage(topic, message, lifetimeMs)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>?, grantResults: IntArray?): Boolean {
        return when (requestCode) {
            WEBRTC_PERMISSION_REQUEST_CODE -> {
                val isMissingPermission: Boolean =
                        grantResults?.isEmpty() ?: false || grantResults?.any { PackageManager.PERMISSION_GRANTED != it } ?: false

                if (isMissingPermission) {
                    eventEmitter.sendReactNativeEvent(RN_EVENT_ERROR, "Unable to start meeting as permissions are not granted")
                    false
                } else {
                    startAudioVideo()
                    true
                }
            }
            else -> false
        }
    }

    @ReactMethod
    fun getAudieDevicesList(promise: Promise) {
        try {
            val listAudioDevices = meetingSession?.audioVideo?.listAudioDevices()
            val map: WritableMap = WritableNativeMap()
            val list: WritableArray = WritableNativeArray()

            listAudioDevices?.forEach {
                val device: WritableMap = WritableNativeMap()
                device.putString("id", it.id)
                device.putString("label", it.label)
                device.putString("type", it.type.name)
                list.pushMap(device)
            }

            map.putArray("devices", list)
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject(
                    "GET_AUDIO_DEVICES_ERROR",
                    "Error fetching audio devices: ${e.localizedMessage}"
            )
        }
    }

    @ReactMethod
    fun switchMicrophoneToSpeaker(promise: Promise) {
        logger.info(TAG, "Called switchMicrophoneWithSpeaker")
        // promise.resolve(MediaDeviceType.AUDIO_BUILTIN_SPEAKER)
        try {
            val listAudioDevices = meetingSession?.audioVideo?.listAudioDevices()

            listAudioDevices?.let { devices ->
                // Ensure that the list is not empty before accessing its type
                if (devices.size >= 2) {
                    val currentDeviceType = meetingSession?.audioVideo?.getActiveAudioDevice()?.type
                    val newDeviceType =
                            if (currentDeviceType == MediaDeviceType.AUDIO_BUILTIN_SPEAKER) {
                                MediaDeviceType.AUDIO_HANDSET
                            } else {
                                MediaDeviceType.AUDIO_BUILTIN_SPEAKER
                            }

                    val newDevice = devices.find { it.type == newDeviceType }
                    newDevice?.let {
                        meetingSession?.audioVideo?.chooseAudioDevice(it)
                        promise.resolve("Microphone to speaker switched successfully")
                    }
                            ?: promise.reject(
                                    "SWITCH_MICROPHONE_SPEAKER_ERROR",
                                    "New device is null or not found in the list"
                            )
                } else {
                    promise.reject(
                            "SWITCH_MICROPHONE_SPEAKER_ERROR",
                            "Audio devices list is empty or insufficient"
                    )
                }
            }
                    ?: promise.reject(
                            "SWITCH_MICROPHONE_SPEAKER_ERROR",
                            "Audio devices list is null"
                    )
        } catch (e: Exception) {
            val errorMessage = "Error switching microphone and speaker: ${e.localizedMessage}"
            logger.error(TAG, errorMessage)
            promise.reject("SWITCH_MICROPHONE_SPEAKER_ERROR", errorMessage)
        }
    }

    @ReactMethod
    fun switchCamera(promise: Promise) {
        logger.info(TAG, "Called switchCamera")

        try {
            meetingSession?.audioVideo?.switchCamera()
            promise.resolve("Camera switched successfully")
        } catch (e: Exception) {
            logger.error(TAG, "Error switching camera: ${e.localizedMessage}")
            promise.reject("SWITCH_CAMERA_ERROR", "Error switching camera: ${e.localizedMessage}")
        }
    }

    // Required for rn built in EventEmitter Calls.
    @ReactMethod
    fun addListener(eventName: String) {

    }

    @ReactMethod
    fun removeListeners(count: Int) {

    }

    override fun getViewModelStore(): ViewModelStore {
        TODO("Not yet implemented")
    }

    override fun onContentShareStarted() {
        TODO("Not yet implemented")
    }

    override fun onContentShareStopped(status: ContentShareStatus) {
        TODO("Not yet implemented")
    }


}


