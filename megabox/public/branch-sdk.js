// Branch.io SDK initialization
(function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);

// Initialize the Branch SDK with redirect handling
branch.init('key_test_asCmg1x2BDyHh3GHNcEzofihqvepEG95', function(err, data) {
    if (err) {
        console.error('Branch SDK initialization error:', err);
        return;
    }
    console.log('Branch SDK initialized:', data);
    
    // Handle deep link data
    if (data && (data.$deeplink_path || data.file_id)) {
        const fileId = data.file_id || (data.$deeplink_path && data.$deeplink_path.split('/').pop());
        if (fileId) {
            // Check if we're on a Branch domain
            if (window.location.hostname.includes('wzhu2.test-app.link') || 
                window.location.hostname.includes('wzhu2.app.link')) {
                // Redirect to our app's preview page
                const appUrl = `${window.location.protocol}//${window.location.host}/preview/${fileId}`;
                window.location.replace(appUrl);
            } else {
                // Dispatch event for React components to handle
                const event = new CustomEvent('branch-data', { 
                    detail: { 
                        fileId: fileId,
                        ...data 
                    } 
                });
                document.dispatchEvent(event);
            }
        }
    }
});

// Track page view
branch.logEvent(
    "pageview",
    {
        "url": window.location.href,
        "user_agent": navigator.userAgent,
        "timestamp": new Date().toISOString()
    },
    function(err) {
        if (err) {
            console.error('Error logging pageview:', err);
        }
    }
);
