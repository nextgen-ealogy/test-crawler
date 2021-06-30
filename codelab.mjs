#!/usr/bin/env zx

await $`rm -Rf docs`
await $`rm -Rf _site`
await $`npm run build`
await $`mv ./_site docs`
await $`rm -Rf _site`

const codelabs = ["firebase", "webcomponents"];

Promise.all(codelabs.map(async c => {
  (async (codelab) => {
    await $`npx @dxdeveloperexperience/codelab-generator ./codelabs/${codelab}/index.adoc ./codelabs/${codelab}/target`
    await $`cp ./codelabs/${codelab}/target/index.html ./codelabs/${codelab}/target/${codelab}.html`  
    await $`cp ./codelabs/${codelab}/target/${codelab}.html docs`  
    await $`cp -R ./codelabs/${codelab}/target/bower_components docs`
    await $`cp -R ./codelabs/${codelab}/target/elements docs`
  })(c)
  
})).then(async () => {
  
  
})



