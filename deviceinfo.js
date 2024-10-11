(function(global) {
    'use strict';

    function DeviceInfo() {
        // Function to fetch device information using User-Agent Client Hints (UA-CH)
        this.fetchDeviceInfo = function(callback) {
            if ('userAgentData' in navigator) {
                navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion', 'architecture', 'model', 'uaFullVersion'])
                    .then(uaHints => {
                        const platform = uaHints.platform || 'Unknown';
                        const platformVersion = uaHints.platformVersion || 'Unknown';
                        const architecture = uaHints.architecture || 'Unknown';
                        const model = uaHints.model || 'Unknown';  
                        const browserVersion = uaHints.uaFullVersion || 'Unknown';
                        const isMobile = navigator.userAgentData.mobile || false;
                        const brands = navigator.userAgentData.brands.map(brand => `${brand.brand} ${brand.version}`).join(', ') || 'Unknown';

                        callback({
                            platform: platform,
                            platformVersion: platformVersion,
                            architecture: architecture,
                            model: model,
                            browserVersion: browserVersion,
                            isMobile: isMobile,
                            brands: brands
                        });
                    })
                    .catch(err => {
                        console.error('Error fetching UA-CH data:', err);
                        callback(this.fallbackDeviceInfo());
                    });
            } else {
                callback(this.fallbackDeviceInfo());
            }
        };

        // Fallback function to detect device using basic platform info if UA-CH is not supported
        this.fallbackDeviceInfo = function() {
            const platform = navigator.platform || 'Unknown';
            const deviceInfo = this.parseUserAgent();

            return {
                platform: platform,
                details: deviceInfo,
                isMobile: /Mobi|Android/i.test(platform), // Simple mobile device detection based on platform
                brands: 'Unknown',  // Can't get brands with UA fallback
                browserVersion: 'Unknown'  // Can't determine precise browser version with UA fallback
            };
        };

        // Function to parse platform information for basic device info (as a fallback)
        this.parseUserAgent = function() {
            let deviceInfo = 'Unknown device';

            if (/android/i.test(navigator.platform)) {
                deviceInfo = 'Android Device';
            } else if (/iphone|ipad|ipod/i.test(navigator.platform)) {
                deviceInfo = 'iOS Device';
            } else if (/linux/i.test(navigator.platform)) {
                deviceInfo = 'Linux Device';
            } else if (/windows/i.test(navigator.platform)) {
                deviceInfo = 'Windows Device';
            } else if (/macintosh/i.test(navigator.platform)) {
                deviceInfo = 'Mac OS Device';
            }

            return deviceInfo;
        };
    }

    // Expose the DeviceInfo class to the global object
    global.DeviceInfo = DeviceInfo;

})(this);
