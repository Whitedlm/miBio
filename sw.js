const CACHE_NAME = 'cache_pwa',
    urlsToCache = [
        './',
        './script.js',
    ]



/*se alamcena en caché los activos estáticos*/
self.addEventListener('install', e =>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache =>{
            return cache.addAll(urlsToCache)
            .then(() => self.skipWaiting())
        })
        .catch(err => console.log('Falló el registro de caché'. err))
    )
})

/*Una vez se instala el sw, se activa y busca los recursos para hacer que funcione sin conexión*/
self.addEventListener('activate', e=>{
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
        .then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cacheName =>{
                    /*Eliminamos lo que ya no se necesita en caché*/
                    if(cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
        /*Le indica al SW  activar el caché actual*/
        .then(() =>self.clients.claim())
    )
})

/*Cuando el navegador recupera una url*/
self.addEventListener('fetch', e=>{
    /*Responder ya sea con el objeto en caché o continuar y buscar la url real*/
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                /*Recuperar del caché*/
                return res
            }
            /*Recuperar de la petición a la url*/
            return fetch(e.reques)
        }

        )
    )
}

)