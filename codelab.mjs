#!/usr/bin/env zx

const codelabs = ["firebase", "webcomponents"];

Promise.all(
  codelabs.map(async (c) => {
    (async (codelab) => {
      await $`npx @dxdeveloperexperience/codelab-generator ./codelabs/${codelab}/index.adoc ./codelabs/${codelab}/target`;
      await $`cp ./codelabs/${codelab}/target/index.html ./codelabs/${codelab}/target/${codelab}.html`;
      await $`cp ./codelabs/${codelab}/target/${codelab}.html _site`;
      await $`cp -R ./codelabs/${codelab}/target/bower_components _site`;
      await $`cp -R ./codelabs/${codelab}/target/elements _site`;
    })(c);
  })
).then(async () => {});
