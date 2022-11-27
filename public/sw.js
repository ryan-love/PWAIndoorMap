
const static = "cache-v2"
const dyCache = "dynamic-v2"
const staticAssets = ["/offline.html","/users/login","/app.html","/manifest.json","https://cdn-webgl.eegeo.com/eegeojs/early_access/latest/eegeo.js","/javascripts/indoor_control.js","/stylesheets/wrld.css","https://indoor-maps-api.eegeo.com/v1/indoor-data/EIM-d4169015-16c0-4c77-b3d0-f1124c68ac69?apikey=5beacb8fb3740737c06ceb57d9e9ab0d&appinfo=Undefined%1F758ac6f343b1f587cee198ab00515e06%1F1922%1F9f2c34542d4d01fa8aa31ab9074e6fecc5877c4c%1FUndefined%1FUndefined%1FJavascript%1FUndefined%1FUndefined%1FJavascript","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css",
    "https://code.jquery.com/jquery-1.12.4.min.js", "https://code.jquery.com/ui/1.12.0/jquery-ui.min.js","https://cdn-webgl.wrld3d.com/eegeojs/public/v1922/eeGeoWebGL.jgz","https://apikey.eegeo.com/generate_204/?token=&appinfo=Undefined%1F758ac6f343b1f587cee198ab00515e06%1F1922%1F9f2c34542d4d01fa8aa31ab9074e6fecc5877c4c%1FUndefined%1FUndefined%1FJavascript%1FUndefined%1FUndefined%1FJavascript","https://apikey.eegeo.com/validate/?appinfo=Undefined%1F758ac6f343b1f587cee198ab00515e06%1F1922%1F9f2c34542d4d01fa8aa31ab9074e6fecc5877c4c%1FUndefined%1FUndefined%1FJavascript%1FUndefined%1FUndefined%1FJavascript","https://cdn-webgl.wrld3d.com/wrldjs/dist/latest/wrld.js","https://cdn-webgl.wrld3d.com/eegeojs/public/v1923/eeGeoWebGL.html.mem"]
self.addEventListener("install",evt => {
    evt.waitUntil(caches.open(static).then(cache => {
        console.log("CACHED");
        cache.addAll(staticAssets)

    }));
    console.log("INSTALLED")
});

self.addEventListener("activate", evt => {
    console.log("ACTIVATED");
    evt.waitUntil(
        caches.keys().then(keys => {
               // console.log(keys)
                return Promise.all(keys
                    .filter(key => key !== static && key !== dyCache)
                    .map(key =>
                    caches.delete(key)
                    )
                )
            }
        )
    )
});
self.addEventListener("fetch", evt => {
    //console.log("FETCH",evt)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                        return caches.open(dyCache).then(cache => {
                                cache.put(
                                    evt.request.url,
                                    fetchRes.clone()
                                );
                                return fetchRes
                            }
                        )
                    }
                )
            }
        ).catch(() => {
            if(evt.request.url.indexOf(".html") > -1) {
                 return caches.match("/offline.html")
            }
        }

            )
    )
});

