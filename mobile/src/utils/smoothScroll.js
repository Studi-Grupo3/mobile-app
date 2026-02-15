// In React Native, scrolling is handled by ScrollView refs
// Use: scrollViewRef.current?.scrollTo({ y: targetY, animated: true })
// This utility is kept for API compatibility but delegates to the ref pattern

export function smoothScrollTo(scrollViewRef, targetY) {
    if (scrollViewRef?.current?.scrollTo) {
        scrollViewRef.current.scrollTo({ y: targetY, animated: true });
    }
}
