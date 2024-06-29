#import "RNVideoViewManager.h"
#import <React/RCTUIManager.h>

@implementation RNVideoViewManager

RCT_EXPORT_MODULE(RNVideoView)

- (UIView *)view
{
    DefaultVideoRenderView *innerView = [[DefaultVideoRenderView alloc] init];
    innerView.contentMode = UIViewContentModeScaleAspectFit;
    return innerView;
}

RCT_EXPORT_VIEW_PROPERTY(mirror, BOOL)

RCT_EXPORT_METHOD(setMirror:(nonnull NSNumber *)reactTag mirror:(BOOL)mirror)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[DefaultVideoRenderView class]]) {
            DefaultVideoRenderView *videoView = (DefaultVideoRenderView *)view;
            videoView.mirror = mirror;
        }
    }];
}

@end