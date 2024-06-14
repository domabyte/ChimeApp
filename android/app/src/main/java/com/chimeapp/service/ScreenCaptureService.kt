package com.chimeapp.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.chimeapp.R

class ScreenCaptureService : Service() {

    private lateinit var notificationManager: NotificationManager

    private val CHANNEL_ID = "ScreenCaptureServiceChannelID"
    private val CHANNEL_NAME = "Screen Share"
    private val SERVICE_ID = 1

    private val binder = ScreenCaptureBinder()

    inner class ScreenCaptureBinder : Binder() {
        fun getService(): ScreenCaptureService = this@ScreenCaptureService
    }

    override fun onCreate() {
        super.onCreate()
        Log.d("ScreenCaptureService", "onCreate called")

        notificationManager =
            applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("ScreenCaptureService", "onStartCommand called with startId: $startId")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager.createNotificationChannel(channel)
            Log.d("ScreenCaptureService", "Notification channel created")
        }

        startForeground(
            SERVICE_ID,
            NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(getString(R.string.screen_capture_notification_tile))
                .setContentText(getText(R.string.screen_capture_notification_text))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build()
        )
        Log.d("ScreenCaptureService", "Service started in foreground")

        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        Log.d("ScreenCaptureService", "onBind called")
        return binder
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d("ScreenCaptureService", "onDestroy called")
    }
}
