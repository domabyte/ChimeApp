#import "RNVideoViewManager.h"

@implementation RNVideoViewManager
static NSMutableDictionary<NSString*, NSValue*> *videoMap;

RCT_EXPORT_MODULE(RNVideoView);

- (UIView *)view
{
  DefaultVideoRenderView *innerView = [[DefaultVideoRenderView alloc] init];
  innerView.contentMode = UIViewContentModeScaleAspectFit;
  return innerView;
}

@end

