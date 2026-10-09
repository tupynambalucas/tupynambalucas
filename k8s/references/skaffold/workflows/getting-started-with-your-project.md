Skaffold requires a `skaffold.yaml`, but - for supported projects - Skaffold can generate a simple
config for you that you can get started with. To configure Skaffold for your application you can run
[`skaffold init`][init].

Running [`skaffold init`][init] at the root of your project directory will walk you through a wizard
and create a `skaffold.yaml` that defines how your project is built and deployed.

[init]: docs/init.md

```bash
skaffold init
```

![init-flow](https://skaffold.dev/images/init-flow.png)

## What's next

You can further set up [File Sync](../filesync.md) for source files that do not need a rebuild in
[dev mode](dev.md).

Skaffold automatically forwards Kubernetes Services in [dev mode](dev.md) if you run it with
`--port-forward`. If your project contains resources other than services, you can set-up
[port-forwarding](../port-forwarding.md) to port-forward these resources in
[`dev`](docs/workflows/dev.md) or [`debug`](debug.md) mode.

For more understanding on how init works, see [`skaffold init`](../init.md).
