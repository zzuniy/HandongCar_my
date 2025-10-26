module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/@vercel/speed-insights/next [external] (@vercel/speed-insights/next, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@vercel/speed-insights/next");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/pages/api/speed.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/speed.js
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$speed$2d$insights$2f$next__$5b$external$5d$__$2840$vercel$2f$speed$2d$insights$2f$next$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@vercel/speed-insights/next [external] (@vercel/speed-insights/next, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$speed$2d$insights$2f$next__$5b$external$5d$__$2840$vercel$2f$speed$2d$insights$2f$next$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$speed$2d$insights$2f$next__$5b$external$5d$__$2840$vercel$2f$speed$2d$insights$2f$next$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    try {
        // 테스트용 URL, 배포된 실제 URL로 바꾸세요
        const urlToTest = 'https://handong-car-my.vercel.app';
        const result = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$speed$2d$insights$2f$next__$5b$external$5d$__$2840$vercel$2f$speed$2d$insights$2f$next$2c$__esm_import$29$__["SpeedInsights"])({
            url: urlToTest
        });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__aa04596a._.js.map