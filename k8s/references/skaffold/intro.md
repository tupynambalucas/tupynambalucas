> [!NOTE] Skaffold will be removed from gcloud CLI releases after January 15, 2027. Going forward,
> Skaffold can be installed following the instructions in the
> [Installing Skaffold documentation](https://skaffold.dev/docs/install/).
>
> On January 29, 2027 the Skaffold GitHub repository will be archived. All existing releases will
> remain available to the users.

Skaffold is a command line tool that facilitates continuous development for container based &
Kubernetes applications. Skaffold handles the workflow for building, pushing, and deploying your
application, and provides building blocks for creating CI/CD pipelines. This enables you to focus on
iterating on your application locally while Skaffold continuously deploys to your local or remote
Kubernetes cluster, local Docker environment or Cloud Run project.

## Features

- Fast local Kubernetes Development
  - **optimized "Source to Kubernetes"** - Skaffold detects changes in your source code and handles
    the pipeline to **build**, **push**, **test** and **deploy** your application automatically with
    **policy-based image tagging** and **highly optimized, fast local workflows**
  - **continuous feedback** - Skaffold automatically manages deployment logging and resource
    port-forwarding
- Skaffold projects work everywhere
  - **share with other developers** - Skaffold is the easiest way to **share your project** with the
    world: `git clone` and `skaffold run`
  - **context aware** - use Skaffold profiles, local user config, environment variables, and flags
    to easily incorporate differences across environments
  - **platform aware** - use cross-platform and multi-platform **build** support, with automatic
    platform detection, to easily handle operating system and architecture differences between the
    development machine and Kubernetes cluster nodes.
  - **CI/CD building blocks** - use `skaffold build`, `skaffold test` and `skaffold deploy` as part
    of your CI/CD pipeline, or simply `skaffold run` end-to-end
  - **GitOps integration** - use `skaffold render` to build your images and render templated
    Kubernetes manifests for use in GitOps workflows
- skaffold.yaml - a single pluggable, declarative configuration for your project
  - **skaffold init** - Skaffold can discover your build and deployment configuration and generate a
    Skaffold config
  - **multi-component apps** - Skaffold supports applications with many components, making it great
    for microservice-based applications
  - **bring your own tools** - Skaffold has a pluggable architecture, allowing for different
    implementations of the build and deploy stages
- Lightweight
  - **client-side only** - Skaffold has no cluster-side component, so there's no overhead or
    maintenance burden to your cluster
  - **minimal pipeline** - Skaffold provides an opinionated, minimal pipeline to keep things simple

## Demo

![architecture](https://skaffold.dev/images/intro.gif)

## Skaffold Workflow and Architecture

Skaffold simplifies your development workflow by organizing common development stages into one
simple command. Every time you run `skaffold dev`, the system

1. Collects and watches your source code for changes
1. Syncs files directly to pods if user marks them as syncable
1. Builds artifacts from the source code
1. Tests the built artifacts using
   [container-structure-tests](https://github.com/GoogleContainerTools/container-structure-test) or
   custom scripts
1. Tags the artifacts
1. Pushes the artifacts
1. Deploys the artifacts
1. Monitors the deployed artifacts
1. Cleans up deployed artifacts on exit (Ctrl+C)

> [!NOTE] Any of these stages can be skipped.

The pluggable architecture is central to Skaffold's design, allowing you to use your preferred tool
or technology in each stage. Also, Skaffold's `profiles` feature grants you the freedom to switch
tools on the fly with a simple flag.

For example, if you are coding on a local machine, you can configure Skaffold to build artifacts
with your local Docker daemon and deploy them to minikube using `kubectl`. When you finalize your
design, you can switch to your production profile and start building with Google Cloud Build and
deploy with Helm.

Skaffold supports the following tools:

### IMAGE BUILDERS

- [Dockerfile](https://docs.docker.com/engine/reference/builder/)
  - locally with Docker
  - in-cluster with [Kaniko](https://github.com/GoogleContainerTools/kaniko)
  - on cloud with [Google Cloud Build](https://cloud.google.com/cloud-build/docs/)
- [Jib](https://github.com/GoogleContainerTools/jib) Maven and Gradle
  - locally
  - on cloud with [Google Cloud Build](https://cloud.google.com/cloud-build/docs/)
- [Bazel](https://bazel.build/) locally
- [Cloud Native Buildpacks](https://buildpacks.io/)
  - locally with Docker
  - on cloud with [Google Cloud Build](https://cloud.google.com/cloud-build/docs/)
- Custom script
  - locally
  - in-cluster

### TESTERS

- [container-structure-test](https://github.com/GoogleContainerTools/container-structure-test)
- custom script

### DEPLOYERS

- Kubernetes Command-Line Interface (`kubectl`)
- Helm
- kustomize

### TAG POLICIES

- tag by git commit
- tag by current date & time
- tag by environment variables based template
- tag by digest of the Docker image

### PUSH STRATEGIES

- don't push - keep the image on the local daemon
- push to registry

![architecture](https://skaffold.dev/images/architecture.png)

Besides the above steps, Skaffold also automatically manages the following utilities for you:

- port-forwarding of deployed resources to your local machine using `kubectl port-forward`
- log aggregation from the deployed pods

## builders

<details>
<summary>Related Documents for builders</summary>

- [cross-platform.md](./builders/cross-platform.md)

</details>

docs/pipeline-stages/builders] no_list: true

Skaffold supports different [tools](builders/builder-types.md) for building images across different
[build environments](builders/build-environments.md).

|                             |         [Local Build](builders/build-environments/local.md)         |       [In Cluster Build](builders/build-environments/in-cluster.md)       |     [Remote on Google Cloud Build](builders/build-environments/cloud-build.md)      |
| --------------------------- | :-----------------------------------------------------------------: | :-----------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| **Dockerfile**              |     [Yes](builders/builder-types/docker.md#dockerfile-locally)      | [Yes](builders/builder-types/docker.md#dockerfile-in-cluster-with-kaniko) | [Yes](builders/builder-types/docker.md#dockerfile-remotely-with-google-cloud-build) |
| **Jib Maven and Gradle**    |  [Yes](builders/builder-types/jib.md#jib-maven-and-gradle-locally)  |                                     -                                     |        [Yes](builders/builder-types/jib.md#remotely-with-google-cloud-build)        |
| **Cloud Native Buildpacks** |             [Yes](builders/builder-types/buildpacks.md)             |                                     -                                     |                     [Yes](builders/builder-types/buildpacks.md)                     |
| **Bazel**                   |               [Yes](builders/builder-types/bazel.md)                |                                     -                                     |                                          -                                          |
| **ko**                      |                 [Yes](builders/builder-types/ko.md)                 |                                     -                                     |                  [Yes](builders/builder-types/ko.md#remote-builds)                  |
| **Custom Script**           | [Yes](builders/builder-types/custom.md#custom-build-script-locally) |  [Yes](builders/builder-types/custom.md#custom-build-script-in-cluster)   |                                          -                                          |

## Configuration

The `build` section in the Skaffold configuration file, `skaffold.yaml`, controls how artifacts are
built. To use a specific tool for building artifacts, add the value representing the tool and
options for using that tool to the `build` section.

For detailed per-builder [Skaffold Configuration](design/config.md) options, see
[skaffold.yaml References](references/yaml.md).

## build-environments

<details>
<summary>Related Documents for build-environments</summary>

- [cloud-build.md](./builders/build-environments/cloud-build.md)
- [in-cluster.md](./builders/build-environments/in-cluster.md)
- [local.md](./builders/build-environments/local.md)

</details>

Skaffold supports the following build environments:

- [Local build](builders/build-environments/local.md)
- [In cluster build](builders/build-environments/in-cluster.md)
- [Remotely on Google Cloud Build](builders/build-environments/cloud-build.md)

## builder-types

<details>
<summary>Related Documents for builder-types</summary>

- [bazel.md](./builders/builder-types/bazel.md)
- [buildpacks.md](./builders/builder-types/buildpacks.md)
- [custom.md](./builders/builder-types/custom.md)
- [docker.md](./builders/builder-types/docker.md)
- [jib.md](./builders/builder-types/jib.md)
- [ko.md](./builders/builder-types/ko.md)

</details>

Skaffold supports the following builder types:

- [Docker](builders/builder-types/docker.md)
- [Jib](builders/builder-types/jib.md)
- [Bazel](builders/builder-types/bazel.md)
- [Custom build script](builders/builder-types/custom.md)
- [ko](builders/builder-types/ko.md)

## deployers

<details>
<summary>Related Documents for deployers</summary>

- [cloudrun.md](./deployers/cloudrun.md)
- [docker.md](./deployers/docker.md)
- [helm.md](./deployers/helm.md)
- [kpt.md](./deployers/kpt.md)
- [kubectl.md](./deployers/kubectl.md)

</details>

[/docs/how-tos/deployers, /docs/pipeline-stages/deployers] no_list: true

When Skaffold deploys your application to Kubernetes, it goes through these steps:

In the default case (no manifest provided using the kubectl or kpt deployer ), skaffold deploy will
do the following:

- the Skaffold renderer _renders_ the final Kubernetes manifests: Skaffold replaces untagged image
  names in the Kubernetes manifests with the final tagged image names. It also might go through the
  extra intermediate step of expanding templates (for helm) or calculating overlays (for kustomize).
  Additionally some deployers (docker) do not render manifests as such don't use this phase.
- the Skaffold deployer _deploys_ the final Kubernetes manifests to the cluster (or to local docker
  for the docker deployer)
- the Skaffold deployer performs [status checks](status-check.md) and waits for the deployed
  resources to stabilize.

### Supported deployers

Skaffold supports the following tools for deploying applications:

- [`kubectl`](./kubectl.md)
- [`helm`](./helm.md)
- [`kpt`](./kpt.md)
- [`docker`](./docker.md) (does not deploy to Kubernetes: see documentation for more details)

Skaffold's deploy configuration is set through the `deploy` section of the `skaffold.yaml`. See each
deployer's page for more information on how to configure them for use in Skaffold. It's also
possible to use a combination of multiple deployers in a single project.

For a detailed discussion on Skaffold configuration, see [Skaffold Concepts](design/config.md) and
[skaffold.yaml References](references/yaml.md).

## design

<details>
<summary>Related Documents for design</summary>

- [api.md](./design/api.md)
- [config.md](./design/config.md)
- [global-config.md](./design/global-config.md)

</details>

[/docs/concepts,/docs/concepts/architecture] no_list: true

Skaffold is designed with pluggability in mind:

![architecture](https://skaffold.dev/images/architecture.png)

The architecture allows you to use Skaffold with the tool you prefer. Skaffold provides built-in
support for the following tools:

- **Build**
  - Dockerfile locally, in-cluster with kaniko or on cloud using Google Cloud Build
  - Jib Maven and Jib Gradle locally or on cloud using Google Cloud Build
  - Bazel locally
  - Cloud Native Buildpacks locally or on cloud using Google Cloud Build
  - Custom script locally or in-cluster
- **Test**
  - [container-structure-test](https://github.com/GoogleContainerTools/container-structure-test)
- **Tag**
  - Git tagger
  - Sha256 tagger
  - Input Digest tagger
  - Env Template tagger
  - DateTime tagger
- **Deploy**
  - Kubernetes Command-Line Interface (`kubectl`)
  - [Helm](https://helm.sh/)
  - [kustomize](https://github.com/kubernetes-sigs/kustomize)

You can combine the tools as you see fit in Skaffold. For experimental projects, you may want to use
local Docker daemon for building artifacts, and deploy them to a Minikube local Kubernetes cluster
with `kubectl`:

![workflow_local](https://skaffold.dev/images/workflow_local.png)

However, for production applications, you might find it more appropriate to build with Google Cloud
Build and deploy using Helm:

![workflow_gcb](https://skaffold.dev/images/workflow_gcb.png)

Skaffold also supports development profiles. You can specify multiple different profiles in your
configuration and use the one that best serves your needs without having to modify the configuration
file. You can learn more about profiles [here](../environment/profiles.md).

## environment

<details>
<summary>Related Documents for environment</summary>

- [env-file.md](./environment/env-file.md)
- [image-registries.md](./environment/image-registries.md)
- [kube-context.md](./environment/kube-context.md)
- [local-cluster.md](./environment/local-cluster.md)
- [profiles.md](./environment/profiles.md)
- [templating.md](./environment/templating.md)

</details>

| Environment Management with Skaffold           |                                                             |
| ---------------------------------------------- | ----------------------------------------------------------- |
| [Environment Variables File](env-file.md)      | Loading environment variables from a file                   |
| [Image Registry Handling](image-registries.md) | Controlling where your images are pushed                    |
| [kube-context](kube-context.md)                | Managing the active Kubernetes context for your cluster     |
| [Local Cluster](local-cluster.md)              | Offline development with Skaffold and Minikube              |
| [Env Var Templating](templating.md)            | Templating your skaffold.yaml using environment variables   |
| [Profiles](profiles.md)                        | cluster-specific skaffold.yaml configuration using profiles |

## install

[/docs/getting-started]

> [!NOTE] To keep Skaffold up to date, update checks are made to Google servers to see if a new
> version of Skaffold is available.
>
> You can turn this update check off by following
> [these instructions](references/privacy.md#update-check).
>
> To help prioritize features and work on improving Skaffold, we collect anonymized Skaffold usage
> data. You can opt out of data collection by following
> [these instructions](resources/telemetry.md).
>
> Your use of this software is subject to the
> [Google Privacy Policy](https://policies.google.com/privacy)

### Managed IDE

### CLOUD CODE

[Cloud Code](https://cloud.google.com/code) provides a managed experience of using Skaffold in
supported IDEs. You can install the `Cloud Code` extension for
[Visual Studio Code](https://cloud.google.com/code/docs/vscode/install) or the plugin for
[JetBrains IDEs](https://cloud.google.com/code/docs/intellij/quickstart-k8s#installing_the_plugin).
It manages and keeps Skaffold up-to-date, along with other common dependencies, and works with any
kubernetes cluster.

### GOOGLE CLOUD SHELL

Google Cloud Platform's [_Cloud Shell_](http://cloud.google.com/shell) provides a free
[browser-based terminal/CLI and editor](https://cloud.google.com/shell#product-demo) with Skaffold,
Minikube, and Docker pre-installed. (Requires a
[Google Account](https://accounts.google.com/SignUp).)

Cloud Shell is a great way to try Skaffold out.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://ssh.cloud.google.com/cloudshell/editor?shellonly=true&cloudshell_git_repo=https%3A%2F%2Fgithub.com%2FGoogleContainerTools%2Fskaffold&cloudshell_working_dir=examples%2Fgetting-started)

### Standalone binary

### LINUX

The latest **stable** binaries can be found here:

- Linux x86_64 (amd64): https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
- Linux ARMv8 (arm64): https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-arm64

Simply download the appropriate binary and add it to your `PATH`. Or, copy+paste one of the
following commands in your terminal:

```bash
# For Linux x86_64 (amd64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && /
sudo install skaffold /usr/local/bin/
```

```bash
# For Linux ARMv8 (arm64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-arm64 && /
sudo install skaffold /usr/local/bin/
```

We also release a **bleeding edge** build, built from the latest commit:

- Linux x86_64 (amd64): https://storage.googleapis.com/skaffold/builds/latest/skaffold-linux-amd64
- Linux ARMv8 (arm64): https://storage.googleapis.com/skaffold/builds/latest/skaffold-linux-arm64

```bash
# For Linux on x86_64 (amd64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/builds/latest/skaffold-linux-amd64 && /
sudo install skaffold /usr/local/bin/
```

```bash
# For Linux on ARMv8 (arm64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/builds/latest/skaffold-linux-arm64 && /
sudo install skaffold /usr/local/bin/
```

### MACOS

The latest **stable** binaries can be found here:

- Darwin x86_64 (amd64):
  https://storage.googleapis.com/skaffold/releases/latest/skaffold-darwin-amd64
- Darwin ARMv8 (arm64):
  https://storage.googleapis.com/skaffold/releases/latest/skaffold-darwin-arm64

Simply download the appropriate binary and add it to your `PATH`. Or, copy+paste one of the
following commands in your terminal:

```bash
# For macOS on x86_64 (amd64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-darwin-amd64 && /
sudo install skaffold /usr/local/bin/
```

```bash
# For macOS on ARMv8 (arm64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-darwin-arm64 && /
sudo install skaffold /usr/local/bin/
```

We also release a **bleeding edge** build, built from the latest commit:

- Darwin x86_64 (amd64): https://storage.googleapis.com/skaffold/builds/latest/skaffold-darwin-amd64
- Darwin ARMv8 (arm64): https://storage.googleapis.com/skaffold/builds/latest/skaffold-darwin-arm64

```bash
# For macOS on x86_64 (amd64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/builds/latest/skaffold-darwin-amd64 && /
sudo install skaffold /usr/local/bin/
```

```bash
# For macOS on ARMv8 (arm64)
curl -Lo skaffold https://storage.googleapis.com/skaffold/builds/latest/skaffold-darwin-arm64 && /
sudo install skaffold /usr/local/bin/
```

Skaffold is also kept up to date on a few central package managers:

### Homebrew

```bash
brew install skaffold
```

### MacPorts

```bash
sudo port install skaffold
```

### WINDOWS

The latest **stable** release binary can be found here:

https://storage.googleapis.com/skaffold/releases/latest/skaffold-windows-amd64.exe

Simply download it and place it in your `PATH` as `skaffold.exe`.

We also release a **bleeding edge** build, built from the latest commit:

https://storage.googleapis.com/skaffold/builds/latest/skaffold-windows-amd64.exe

### Scoop

Skaffold can be installed using the [Scoop package manager](https://scoop.sh/) from the
[extras bucket](https://github.com/lukesampson/scoop-extras#readme). This package is not maintained
by the Skaffold team.

```powershell
scoop bucket add extras
scoop install skaffold
```

### Chocolatey

Skaffold can be installed using the
[Chocolatey package manager](https://chocolatey.org/packages/skaffold). This package is not
maintained by the Skaffold team.

> [!NOTE] Chocolatey's installation mechanism interferes with <kbd>Ctrl</kbd>+<kbd>C</kbd> handling
> and
> [prevents Skaffold from cleaning up deployments](https://github.com/GoogleContainerTools/skaffold/issues/4815).
> This cannot be fixed by Skaffold. For more information about this defect see
> [chocolatey/shimgen#32](https://github.com/chocolatey/shimgen/issues/32).

```bash
choco install -y skaffold
```

### GCLOUD

If you have the Google Cloud SDK installed on your machine, you can quickly install Skaffold as a
bundled component.

Make sure your gcloud installation and the components are up to date:

`gcloud components update`

Then, install Skaffold:

`gcloud components install skaffold`

### DOCKER

### Stable binary

For the latest **stable** release, you can use:

`docker run gcr.io/k8s-skaffold/skaffold:latest skaffold <command>`

### Bleeding edge binary

For the latest **bleeding edge** build:

`docker run gcr.io/k8s-skaffold/skaffold:edge skaffold <command>`

## pipeline-stages

[/docs/concepts/pipeline] no_list: true

Skaffold features a multi-stage workflow:

![workflow](https://skaffold.dev/images/workflow.png)

When you start Skaffold, it collects source code in your project and builds artifacts with the tool
of your choice; the artifacts, once successfully built, are tagged as you see fit and pushed to the
repository you specify. In the end of the workflow, Skaffold also helps you deploy the artifacts to
your Kubernetes cluster, once again using the tools you prefer.

Skaffold allows you to skip stages. If, for example, you run Kubernetes locally with
[Minikube](https://kubernetes.io/docs/setup/minikube/), Skaffold will not push artifacts to a remote
repository.

| Skaffold Pipeline stages|Description| |----------|-------|------| | [Init](init.md) | generate a
starting point for Skaffold configuration | | [Build](builders.md) | build images with different
builders | | [Render](renderers.md) | render manifests with different renderers | |
[Tag](taggers.md) | tag images based on different policies | | [Test](testers.md) | run tests with
testers | | [Deploy](deployers.md) | deploy with kubectl, kustomize or helm | | [Verify](verify.md)
| verify deployments with specified test containers | | [File Sync](filesync.md) | sync changed
files directly to containers | | [Log Tailing](log-tailing.md) | tail logs from workloads | |
[Port Forwarding](port-forwarding.md) | forward ports from services and arbitrary resources to
localhost | | [Deploy Status Checking](status-check.md) | wait for deployed resources to stabilize |
| [Lifecycle Hooks](lifecycle-hooks.md) | run code triggered by different events during the skaffold
process lifecycle | | [Cleanup](cleanup.md) | cleanup manifests and images |

## quickstart

### STANDALONE

Follow this tutorial if you're using the Skaffold
[standalone binary](../install/intro.md#standalone-binary). It walks through running Skaffold on a
small Kubernetes app built with [Docker](https://www.docker.com/) inside
[minikube](https://minikube.sigs.k8s.io) and deployed with
[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

> [!NOTE] If you are looking to generate a new project templated to use Skaffold best-practices and
> features, see the
> [Google Cloud Solutions Template](https://github.com/GoogleCloudPlatform/solutions-template).

> [!NOTE] Aside from `Docker` and `kubectl`, Skaffold also supports a variety of other tools and
> workflows; see [Tutorials](tutorials.md) for more information.

In this quickstart, you will:

- Use **skaffold init** to bootstrap your Skaffold config.
- Use **skaffold dev** to automatically build and deploy your application when your code changes.
- Use **skaffold build** and **skaffold test** to tag, push, and test your container images.
- Use **skaffold render** and **skaffold apply** to generate and deploy Kubernetes manifests as part
  of a GitOps workflow.

## Set up

### Install Skaffold, minikube, and kubectl

This tutorial requires Skaffold, minikube, and kubectl.

1. [Install Skaffold](install.md).
1. [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
1. [Install minikube](https://minikube.sigs.k8s.io/docs/start/).

This tutorial uses minikube because Skaffold knows how to build the app using the Docker daemon
hosted inside minikube. This means we don't need a registry to host the app's container images.

### Clone the sample app

Let's get a sample application set up to use Skaffold.

1. Clone the Skaffold repository:

   ```bash
   git clone https://github.com/GoogleContainerTools/skaffold
   ```

1. Change to the `examples/buildpacks-node-tutorial` directory.

   ```bash
   cd skaffold/examples/buildpacks-node-tutorial
   ```

## Initialize Skaffold

Your working directory is the application directory, `skaffold/examples/buildpacks-node-tutorial`.
This will be our root Skaffold directory.

This sample application is written in Node, but Skaffold is language-agnostic and works with any
containerized application.

### Bootstrap Skaffold configuration

1. Run the following command to generate a `skaffold.yaml` config file:

   ```bash
   skaffold init
   ```

1. When prompted to choose the builder, press enter to accept the default selection.

1. When asked which builders you would like to create Kubernetes resources for, press enter to
   accept the default selection.

1. When asked if you want to write this configuration to skaffold.yaml, type "y" for yes.

1. Open your new **skaffold.yaml**, generated at
   `skaffold/examples/buildpacks-node-tutorial/skaffold.yaml`. All of your Skaffold configuration
   lives in this file. We will go into more detail about how it works in later steps.

## Use Skaffold for continuous development

Skaffold speeds up your development loop by automatically building and deploying the application
whenever your code changes.

### Start minikube

1. To see this in action, let's start up minikube so Skaffold has a cluster to run your application.

   ```bash
   minikube start --profile custom
   skaffold config set --global local-cluster true
   eval $(minikube -p custom docker-env)
   ```

This may take several minutes.

### Use `skaffold dev`

1. Run the following command to begin using Skaffold for continuous development:

   ```bash
   skaffold dev
   ```

   Notice how Skaffold automatically builds and deploys your application. You should see the
   following application output in your terminal:

   ```terminal
   Example app listening on port 3000!
   ```

   To browse to the web page, open a new terminal and run:

   ```terminal
   minikube tunnel -p custom
   ```

   Now open your browser at `http://localhost:3000`. This displays the content of
   `public/index.html` file.

   Skaffold is now watching for any file changes, and will rebuild your application automatically.
   Let's see this in action.

1. Open `skaffold/examples/buildpacks-node-tutorial/src/index.js` and change line 10 to the
   following:

   ```
   app.listen(port, () => console.log(`Example app listening on port ${port}! This is version 2.`))
   ```

   Notice how Skaffold automatically hot reloads your code changes to your application running in
   minikube, intelligently syncing only the file you changed. Your application is now automatically
   deployed with the changes you made, as it prints the following to your terminal:

   ```terminal
   Example app listening on port 3000! This is version 2.
   ```

### Exit dev mode

1. Let's stop continuous dev mode by pressing the following keys in your terminal:

   ```terminal
   Ctrl+C
   ```

   Skaffold will clean up all deployed artifacts and end dev mode.

## Use Skaffold for continuous integration

While Skaffold shines for continuous development, it can also be used for continuous integration
(CI). Let's use Skaffold to build and test a container image.

### Build an image

Your CI pipelines can run `skaffold build` to build, tag, and push your container images to a
registry.

1. Try this out by running the following command:

   ```bash
   export STATE=$(git rev-list -1 HEAD --abbrev-commit)
   skaffold build --file-output build-$STATE.json
   ```

   Skaffold writes the output of the build to a JSON file, which we'll pass to our continuous
   delivery (CD) process in the next step.

### Test an image

Skaffold can also run tests against your images before deploying them. Let's try this out by
creating a simple custom test.

1. Open
   your<walkthrough-editor-open-file filePath="cloudshell_open/skaffold/examples/buildpacks-node-tutorial/skaffold.yaml">`skaffold.yaml`</walkthrough-editor-open-file>
   and add the following test configuration to the bottom, without any additional indentation:

   ```
   test:
   - image: skaffold-buildpacks-node
     custom:
       - command: echo This is a custom test commmand!
   ```

   Now you have a simple custom test set up that will run a bash command and await a successful
   response.

1. Run the following command to execute this test with Skaffold:

   ```bash
   skaffold test --build-artifacts build-$STATE.json
   ```

## Use Skaffold for continuous delivery

Let's learn how Skaffold can handle continuous delivery (CD).

### Deploy in a single step

1. For simple deployments, run `skaffold deploy`:

   ```bash
   skaffold deploy -a build-$STATE.json
   ```

   Skaffold hydrates your Kubernetes manifest with the image you built and tagged in the previous
   step, and deploys the application.

### Render and apply in separate steps

For GitOps delivery workflows, you may want to decompose your deployments into separate render and
apply phases. That way, you can commit your hydrated Kubernetes manifests to source control before
they are applied.

1. Run the following command to render a hydrated manifest:

   ```bash
   skaffold render -a build-$STATE.json --output render.yaml --digest-source local
   ```

   Open `skaffold/examples/buildpacks-node-tutorial/render.yaml` to check out the hydrated manifest.

1. Next, run the following command to apply your hydrated manifest:

   ```bash
   skaffold apply render.yaml
   ```

You have now successfully deployed your application in two ways.

## Congratulations, you successfully deployed with Skaffold!

You have learned how to use Skaffold for continuous development, integration, and delivery.

### CLOUD CODE

Follow these quickstart guides if you're using Skaffold with the
[Cloud Code](../install/intro.md#managed-ide) IDE extensions:

### [Cloud Code for VSCode](https://cloud.google.com/code/docs/vscode/quickstart-k8s)

Create, locally develop, debug, and run a Kubernetes application with Cloud Code for VSCode.

<a href="https://cloud.google.com/code/docs/vscode/quickstart-k8s">![vscode](https://skaffold.dev/images/cloud-code-quick-deploy.gif)</a>

<br />

### [Cloud Code for IntelliJ](https://cloud.google.com/code/docs/intellij/quickstart-k8s)

Create, locally develop, debug, and run a Kubernetes application with Cloud Code for IntelliJ.

<a href="https://cloud.google.com/code/docs/intellij/quickstart-k8s">![intellij](https://skaffold.dev/images/intellij-quickstart-runthrough.gif)</a>

### CLOUD SHELL

Skip any setup by using Google Cloud Platform's [_Cloud Shell_](http://cloud.google.com/shell),
which provides a
[browser-based terminal/CLI and editor](https://cloud.google.com/shell#product-demo). Cloud Shell
comes with Skaffold, Minikube, and Docker pre-installed, and is free (requires a
[Google Account](https://accounts.google.com/SignUp)).

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://ssh.cloud.google.com/cloudshell/editor?show=ide%2Cterminal&cloudshell_git_repo=https://github.com/GoogleContainerTools/skaffold&walkthrough_id=skaffold--skaffold_onboarding&cloudshell_workspace=/examples/buildpacks-node-tutorial&cloudshell_open_in_editor=src/index.js)

## What's next

For getting started with your project, see the
[Getting Started With Your Project](workflows/getting-started-with-your-project.md) workflow.

For more in-depth topics of Skaffold, explore [Configuration](design/config.md),
[Skaffold Pipeline](pipeline-stages.md), and [Architecture and Design](design.md).

To learn more about how Skaffold builds, tags, and deploys your app, see the How-to Guides on using
[Builders](builders.md), [Taggers](taggers.md), and [Deployers](deployers.md).

[Skaffold Tutorials](tutorials.md) details some of the common use cases of Skaffold.

Questions? See our [Community section](resources.md#Community) for ways to get in touch.

:mega: **Please fill out our [quick 5-question survey](https://forms.gle/BMTbGQXLWSdn7vEs6)** to
tell us how satisfied you are with Skaffold, and what improvements we should make. Thank you!
:dancers:

## references

<details>
<summary>Related Documents for references</summary>

- [deprecation.md](./references/deprecation.md)
- [privacy.md](./references/privacy.md)

</details>

| Skaffold References                             |
| ----------------------------------------------- |
| [CLI](references/cli.md)                        |
| [skaffold.yaml](references/yaml.md)             |
| [gRPC API](references/api/grpc.md)              |
| [HTTP API](references/api/swagger.md)           |
| [Privacy Settings](references/privacy.md)       |
| [Deprecation Policy](references/deprecation.md) |

## api

<details>
<summary>Related Documents for api</summary>

- [grpc.md](./references/api/grpc.md)
- [swagger.md](./references/api/swagger.md)

</details>

Skaffold exposes an API for retrieving information about the state of the process and to provide
fine-grained control over the execution. For a detailed description of the
[Skaffold API](design/api.md).

The same API is exposed two ways, through gRPC and HTTP, for which the generated reference can be
found below:

- [gRPC API](references/api/grpc.md)
- [HTTP API](references/api/swagger.md)

## api-v2

<details>
<summary>Related Documents for api-v2</summary>

- [grpc.md](./references/api-v2/grpc.md)
- [swagger.md](./references/api-v2/swagger.md)

</details>

Skaffold exposes an API for retrieving information about the state of the process and to provide
fine-grained control over the execution. For a detailed description of the
[Skaffold API](design/api.md).

The same API is exposed two ways, through gRPC and HTTP, for which the generated reference can be
found below:

- [gRPC API](references/api-v2/grpc.md)
- [HTTP API](references/api-v2/swagger.md)

## cli

Skaffold command-line interface provides the following commands:

End-to-end pipelines:

- [skaffold run](#skaffold-run) - to build & deploy once
- [skaffold dev](#skaffold-dev) - to trigger the watch loop build & deploy workflow with cleanup on
  exit
- [skaffold debug](#skaffold-debug) - to run a pipeline in debug mode

Pipeline building blocks for CI/CD:

- [skaffold build](#skaffold-build) - to just build and tag your image(s)
- [skaffold deploy](#skaffold-deploy) - to deploy the given image(s)
- [skaffold delete](#skaffold-delete) - to cleanup the deployed artifacts
- [skaffold render](#skaffold-render) - build and tag images, and output templated Kubernetes
  manifests
- [skaffold apply](#skaffold-apply) - to apply hydrated manifests to a cluster

Getting started with a new project:

- [skaffold init](#skaffold-init) - to bootstrap Skaffold config
- [skaffold fix](#skaffold-fix) - to upgrade from older skaffold.yaml schema version to newer
  skaffold.yaml schema version

Other Commands:

- [skaffold help](#skaffold-help) - print help
- [skaffold version](#skaffold-version) - get Skaffold version
- [skaffold completion](#skaffold-completion) - setup tab completion for the CLI
- [skaffold config](#skaffold-config) - manage context specific parameters
- [skaffold credits](#skaffold-credits) - export third party notices to given path
  (./skaffold-credits by default)
- [skaffold diagnose](#skaffold-diagnose) - diagnostics of Skaffold works in your project
- [skaffold schema](#skaffold-schema) - list and print json schemas used to validate skaffold.yaml
  configuration

## Global flags

| Flag                        | Description                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `-h, --help`                | Prints the HELP file for the current command.                                                                                       |
| `-v, --verbosity LOG-LEVEL` | Uses a specific log level. Available log levels are `info`, `warn`, `error`, `fatal`, `debug` and `trace`. Default value is `warn`. |

## Global environment variables

<details>
<summary>View Environment Variables</summary>

## Global environment variables

| Flag                    | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `SKAFFOLD_UPDATE_CHECK` | Enables checking for latest version of the Skaffold binary. By default it's `true`. |

</details>

## Skaffold commands

<!--
******
To edit this file above edit index_header - the rest of the file is autogenerated by cmd/skaffold/man
******
-->

### skaffold

<details>
<summary>End-to-end Pipelines</summary>

```text
run                 Run a pipeline
  dev                 Run a pipeline in development mode
  debug               Run a pipeline in debug mode
```

</details>

<details>
<summary>Pipeline Building Blocks</summary>

```text
build               Build the artifacts
  test                Run tests against your built application images
  deploy              Deploy pre-built artifacts
  delete              Delete any resources deployed by Skaffold
  render              Generate rendered Kubernetes manifests
  apply               Apply hydrated manifests to a cluster
  verify              Run verification tests against skaffold deployments
```

</details>

<details>
<summary>Getting Started With a New Project</summary>

```text
init                Generate configuration for deploying an application
```

</details>

<details>
<summary>Other Commands</summary>

```text
completion          Output shell completion for the given shell (bash, fish or zsh)
  config              Interact with the global Skaffold config file (defaults to `$HOME/.skaffold/config`)
  diagnose            Run a diagnostic on Skaffold
  exec                Execute a custom action
  fix                 Update old configuration to a newer schema version
  schema              List JSON schemas used to validate skaffold.yaml configuration
  version             Print the version information

Use "skaffold <command> --help" for more information about a given command.
Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_COLOR` (same as `--color`)
- `SKAFFOLD_INTERACTIVE` (same as `--interactive`)
- `SKAFFOLD_TIMESTAMPS` (same as `--timestamps`)
- `SKAFFOLD_UPDATE_CHECK` (same as `--update-check`)
- `SKAFFOLD_VERBOSITY` (same as `--verbosity`)
````

</details>

### skaffold apply

Apply hydrated manifests to a cluster

<details>
<summary>Examples</summary>

```text
# Hydrate Kubernetes pod manifest first
  skaffold render --output rendered-pod.yaml

  # Then create resources on your cluster from that hydrated manifest
  skaffold apply rendered-pod.yaml
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Recreate Kubernetes resources if necessary for deployment, warning: might cause downtime!

    --iterative-status-check=true:
	Run `status-check` iteratively after each deploy step, instead of all-together at the end of all deploys (default).

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --status-check=:
	Wait for deployed resources to stabilize

    --status-check-selectors='':
	File containing resource selectors for kubernetes resources status check. A sample file looks like the following: {   "selectors":[     {       "group":"my.domain",       "kind":"MyCRD"     }     ] } The values of "group" and "kind" are regular expressions.

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    --tail=false:
	Stream logs from deployed objects

    --tolerate-failures-until-deadline=false:
	Configures `status-check` to tolerate failures until Skaffold's statusCheckDeadline duration or the deployments progressDeadlineSeconds  Otherwise deployment failures skaffold encounters will immediately fail the deployment.  Defaults to 'false'

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold apply [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_ITERATIVE_STATUS_CHECK` (same as `--iterative-status-check`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_STATUS_CHECK_SELECTORS` (same as `--status-check-selectors`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAIL` (same as `--tail`)
- `SKAFFOLD_TOLERATE_FAILURES_UNTIL_DEADLINE` (same as `--tolerate-failures-until-deadline`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
````

</details>

### skaffold build

Build the artifacts

<details>
<summary>Examples</summary>

```text
# Build all the artifacts
  skaffold build

  # Build artifacts with a profile activated
  skaffold build -p <profile>

  # Build artifacts whose image name contains <db>
  skaffold build -b <db>

  # Quietly build artifacts and output the image names as json
  skaffold build -q > build_result.json

  # Build the artifacts and then deploy them
  skaffold build -q | skaffold deploy --build-artifacts -

  # Print the final image names
  skaffold build -q --dry-run
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --build-concurrency=-1:
	Number of concurrently running builds. Set to 0 to run all builds in parallel. Doesn't violate build order among dependencies.

    -b, --build-image=[]:
	Only build artifacts with image names that contain the given substring. Default is to build sources for all artifacts

    --cache-artifacts=true:
	Set to false to disable default caching of artifacts

    --cache-file='':
	Specify the location of the cache file (default $HOME/.skaffold/cache)

    --check-cluster-node-platforms=false:
	When set to true, images are built for the target platforms matching the active kubernetes cluster node platforms. Enabled by default for `dev`, `debug` and `run`

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --disable-multi-platform-build=false:
	When set to true, forces only single platform image builds even when multiple target platforms are specified. Enabled by default for `dev` and `debug` modes, to keep dev-loop fast

    --dry-run=false:
	Don't build images, just compute the tag for each artifact.

    --file-output='':
	Filename to write build images to

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --insecure-registry=[]:
	Target registries for built images which are not secure

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --mute-logs=[]:
	mute logs for specified stages in pipeline (build, deploy, status-check, none, all)

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    -o, --output={{json .}}:
	Used in conjunction with --quiet flag. Format output with go-template. For full struct documentation, see https://godoc.org/github.com/GoogleContainerTools/skaffold/v2/cmd/skaffold/app/flags#BuildOutput

    --platform=[]:
	The platform to target for the build artifacts

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --push=:
	Push the built images to the specified image repository.

    -q, --quiet=false:
	Suppress the build output and print image built on success. See --output to format output.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --skip-tests=false:
	Whether to skip the tests after building

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --toot=false:
	Emit a terminal beep after the deploy is complete

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold build [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_CONCURRENCY` (same as `--build-concurrency`)
- `SKAFFOLD_BUILD_IMAGE` (same as `--build-image`)
- `SKAFFOLD_CACHE_ARTIFACTS` (same as `--cache-artifacts`)
- `SKAFFOLD_CACHE_FILE` (same as `--cache-file`)
- `SKAFFOLD_CHECK_CLUSTER_NODE_PLATFORMS` (same as `--check-cluster-node-platforms`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_DISABLE_MULTI_PLATFORM_BUILD` (same as `--disable-multi-platform-build`)
- `SKAFFOLD_DRY_RUN` (same as `--dry-run`)
- `SKAFFOLD_FILE_OUTPUT` (same as `--file-output`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_INSECURE_REGISTRY` (same as `--insecure-registry`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_MUTE_LOGS` (same as `--mute-logs`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_OUTPUT` (same as `--output`)
- `SKAFFOLD_PLATFORM` (same as `--platform`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_PUSH` (same as `--push`)
- `SKAFFOLD_QUIET` (same as `--quiet`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SKIP_TESTS` (same as `--skip-tests`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_TOOT` (same as `--toot`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
````

</details>

### skaffold completion

Output shell completion for the given shell (bash, fish or zsh)

<details>
<summary>Usage</summary>

```text
skaffold completion SHELL [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).
```

</details>

### skaffold config

Interact with the global Skaffold config file (defaults to `$HOME/.skaffold/config`)

<details>
<summary>Available Commands</summary>

```text
list          List all values set in the global Skaffold config
  set           Set a value in the global Skaffold config
  unset         Unset a value in the global Skaffold config

Use "skaffold config <command> --help" for more information about a given command.
```

</details>

### skaffold config list

List all values set in the global Skaffold config

<details>
<summary>Options</summary>

```text
-a, --all=false:
	Show values for all kubecontexts

    -c, --config='':
	Path to Skaffold config

    -k, --kube-context='':
	Kubectl context to set values against
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold config list [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ALL` (same as `--all`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
````

</details>

### skaffold config set

Set a value in the global Skaffold config

<details>
<summary>Examples</summary>

```text
# Mark a registry as insecure
  skaffold config set insecure-registries <insecure1.io>

  # Globally set the default image repository
  skaffold config set default-repo <myrepo>

  # Globally set multi-level repo support
  skaffold config set multi-level-repo true

  # Disable pushing images for a given Kubernetes context
  skaffold config set --kube-context <mycluster> local-cluster true
```

</details>

<details>
<summary>Options</summary>

```text
-c, --config='':
	Path to Skaffold config

    -g, --global=false:
	Set value for global config

    -k, --kube-context='':
	Kubectl context to set values against
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold config set [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_GLOBAL` (same as `--global`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
````

</details>

### skaffold config unset

Unset a value in the global Skaffold config

<details>
<summary>Options</summary>

```text
-c, --config='':
	Path to Skaffold config

    -g, --global=false:
	Set value for global config

    -k, --kube-context='':
	Kubectl context to set values against
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold config unset [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_GLOBAL` (same as `--global`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
````

</details>

### skaffold debug

Run a pipeline in debug mode

<details>
<summary>Examples</summary>

```text
# Launch with port-forwarding
  skaffold debug --port-forward
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --auto=false:
	Run with an auto-generated skaffold configuration. This will create a temporary `skaffold.yaml` file and kubernetes manifests necessary to run the application

    --auto-build=false:
	When set to false, builds wait for API request instead of running automatically

    --auto-create-config=true:
	If true, skaffold will try to create a config for the user's run if it doesn't find one

    --auto-deploy=false:
	When set to false, deploys wait for API request instead of running automatically

    --auto-sync=false:
	When set to false, syncs wait for API request instead of running automatically

    --build-concurrency=-1:
	Number of concurrently running builds. Set to 0 to run all builds in parallel. Doesn't violate build order among dependencies.

    --cache-artifacts=true:
	Set to false to disable default caching of artifacts

    --cache-file='':
	Specify the location of the cache file (default $HOME/.skaffold/cache)

    --check-cluster-node-platforms=true:
	When set to true, images are built for the target platforms matching the active kubernetes cluster node platforms. Enabled by default for `dev`, `debug` and `run`

    --cleanup=true:
	Delete deployments after dev or debug mode is interrupted

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --disable-multi-platform-build=true:
	When set to true, forces only single platform image builds even when multiple target platforms are specified. Enabled by default for `dev` and `debug` modes, to keep dev-loop fast

    --enable-platform-node-affinity=true:
	If true, when deploying to a mixed node cluster, skaffold will add platform (os/arch) node affinity definition to rendered manifests based on the image platforms

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Recreate Kubernetes resources if necessary for deployment, warning: might cause downtime!

    --hydration-dir='.kpt-pipeline':
	The directory to where the (kpt) hydration takes place. Default to a hidden directory .kpt-pipeline.

    --insecure-registry=[]:
	Target registries for built images which are not secure

    --iterative-status-check=true:
	Run `status-check` iteratively after each deploy step, instead of all-together at the end of all deploys (default).

    --keep-running-on-failure=false:
	If true, the session will be suspended instead of ending if any errors occur, the user can fix the errors during the session suspension, the session can be restored and continued by pressing any key.

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --mute-logs=[]:
	mute logs for specified stages in pipeline (build, deploy, status-check, none, all)

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --no-prune=false:
	Skip removing images and containers built by Skaffold during cleanup after dev or debug mode

    --no-prune-children=false:
	Skip removing layers reused by Skaffold

    --platform=[]:
	The platform to target for the build artifacts

    --port-forward=user,debug:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --protocols=[]:
	Priority sorted order of debugger protocols to support.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --resource-selector-rules-file='':
	Path to JSON file specifying the deny list of yaml objects for skaffold to NOT transform with 'image' and 'label' field replacements.  NOTE: this list is additive to skaffold's default denylist and denylist has priority over allowlist

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --skip-tests=false:
	Whether to skip the tests after building

    --status-check=:
	Wait for deployed resources to stabilize

    --status-check-selectors='':
	File containing resource selectors for kubernetes resources status check. A sample file looks like the following: {   "selectors":[     {       "group":"my.domain",       "kind":"MyCRD"     }     ] } The values of "group" and "kind" are regular expressions.

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --tail=true:
	Stream logs from deployed objects

    --tolerate-failures-until-deadline=false:
	Configures `status-check` to tolerate failures until Skaffold's statusCheckDeadline duration or the deployments progressDeadlineSeconds  Otherwise deployment failures skaffold encounters will immediately fail the deployment.  Defaults to 'false'

    --toot=false:
	Emit a terminal beep after the deploy is complete

    --trigger='notify':
	How is change detection triggered? (polling, notify, or manual)

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit

    --wait-for-deletions=true:
	Wait for pending deletions to complete before a deployment

    --wait-for-deletions-delay=2s:
	Delay between two checks for pending deletions

    --wait-for-deletions-max=1m0s:
	Max duration to wait for pending deletions

    -w, --watch-image=[]:
	Choose which artifacts to watch. Artifacts with image names that contain the expression will be watched only. Default is to watch sources for all artifacts

    -i, --watch-poll-interval=1000:
	Interval (in ms) between two checks for file changes
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold debug [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_AUTO` (same as `--auto`)
- `SKAFFOLD_AUTO_BUILD` (same as `--auto-build`)
- `SKAFFOLD_AUTO_CREATE_CONFIG` (same as `--auto-create-config`)
- `SKAFFOLD_AUTO_DEPLOY` (same as `--auto-deploy`)
- `SKAFFOLD_AUTO_SYNC` (same as `--auto-sync`)
- `SKAFFOLD_BUILD_CONCURRENCY` (same as `--build-concurrency`)
- `SKAFFOLD_CACHE_ARTIFACTS` (same as `--cache-artifacts`)
- `SKAFFOLD_CACHE_FILE` (same as `--cache-file`)
- `SKAFFOLD_CHECK_CLUSTER_NODE_PLATFORMS` (same as `--check-cluster-node-platforms`)
- `SKAFFOLD_CLEANUP` (same as `--cleanup`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_DISABLE_MULTI_PLATFORM_BUILD` (same as `--disable-multi-platform-build`)
- `SKAFFOLD_ENABLE_PLATFORM_NODE_AFFINITY` (same as `--enable-platform-node-affinity`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_HYDRATION_DIR` (same as `--hydration-dir`)
- `SKAFFOLD_INSECURE_REGISTRY` (same as `--insecure-registry`)
- `SKAFFOLD_ITERATIVE_STATUS_CHECK` (same as `--iterative-status-check`)
- `SKAFFOLD_KEEP_RUNNING_ON_FAILURE` (same as `--keep-running-on-failure`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_MUTE_LOGS` (same as `--mute-logs`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_NO_PRUNE` (same as `--no-prune`)
- `SKAFFOLD_NO_PRUNE_CHILDREN` (same as `--no-prune-children`)
- `SKAFFOLD_PLATFORM` (same as `--platform`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_PROTOCOLS` (same as `--protocols`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RESOURCE_SELECTOR_RULES_FILE` (same as `--resource-selector-rules-file`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SKIP_TESTS` (same as `--skip-tests`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_STATUS_CHECK_SELECTORS` (same as `--status-check-selectors`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_TAIL` (same as `--tail`)
- `SKAFFOLD_TOLERATE_FAILURES_UNTIL_DEADLINE` (same as `--tolerate-failures-until-deadline`)
- `SKAFFOLD_TOOT` (same as `--toot`)
- `SKAFFOLD_TRIGGER` (same as `--trigger`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
- `SKAFFOLD_WAIT_FOR_DELETIONS` (same as `--wait-for-deletions`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_DELAY` (same as `--wait-for-deletions-delay`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_MAX` (same as `--wait-for-deletions-max`)
- `SKAFFOLD_WATCH_IMAGE` (same as `--watch-image`)
- `SKAFFOLD_WATCH_POLL_INTERVAL` (same as `--watch-poll-interval`)
````

</details>

### skaffold delete

Delete any resources deployed by Skaffold

<details>
<summary>Examples</summary>

```text
# Print the resources to be deleted
  skaffold delete --dry-run
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --dry-run=false:
	Don't delete resources, just print them.

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --set=[]:
	overrides templated manifest fields by provided key-value pairs

    --set-value-file='':
	overrides templated manifest fields by a file containing key-value pairs in .env file format

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold delete [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_DRY_RUN` (same as `--dry-run`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_SET` (same as `--set`)
- `SKAFFOLD_SET_VALUE_FILE` (same as `--set-value-file`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
````

</details>

### skaffold deploy

Deploy pre-built artifacts

<details>
<summary>Examples</summary>

```text
# Build the artifacts and collect the tags into a file
  skaffold build --file-output=tags.json

  # Deploy those tags
  skaffold deploy --build-artifacts=tags.json

  # Build the artifacts and then deploy them
  skaffold build -q | skaffold deploy --build-artifacts -
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -a, --build-artifacts=:
	File containing pre-built images to use instead of rebuilding artifacts. A sample file looks like the following: {   "builds":[     {       "imageName":"registry/image1",       "tag":"registry/image1:tag"     },{       "imageName":"registry/image2",       "tag":"registry/image2:tag"     }] } The build result from a previous 'skaffold build --file-output' run can be used here

    --build-concurrency=-1:
	Number of concurrently running builds. Set to 0 to run all builds in parallel. Doesn't violate build order among dependencies.

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --enable-platform-node-affinity=false:
	If true, when deploying to a mixed node cluster, skaffold will add platform (os/arch) node affinity definition to rendered manifests based on the image platforms

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Recreate Kubernetes resources if necessary for deployment, warning: might cause downtime!

    --hydration-dir='.kpt-pipeline':
	The directory to where the (kpt) hydration takes place. Default to a hidden directory .kpt-pipeline.

    -i, --images=:
	A list of pre-built images to deploy, either tagged images or NAME=TAG pairs

    --iterative-status-check=true:
	Run `status-check` iteratively after each deploy step, instead of all-together at the end of all deploys (default).

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    --load-images=false:
	If true, skaffold will force load the container images into the local cluster.

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --mute-logs=[]:
	mute logs for specified stages in pipeline (build, deploy, status-check, none, all)

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --port-forward=off:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --resource-selector-rules-file='':
	Path to JSON file specifying the deny list of yaml objects for skaffold to NOT transform with 'image' and 'label' field replacements.  NOTE: this list is additive to skaffold's default denylist and denylist has priority over allowlist

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --status-check=:
	Wait for deployed resources to stabilize

    --status-check-selectors='':
	File containing resource selectors for kubernetes resources status check. A sample file looks like the following: {   "selectors":[     {       "group":"my.domain",       "kind":"MyCRD"     }     ] } The values of "group" and "kind" are regular expressions.

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --tail=false:
	Stream logs from deployed objects

    --tolerate-failures-until-deadline=false:
	Configures `status-check` to tolerate failures until Skaffold's statusCheckDeadline duration or the deployments progressDeadlineSeconds  Otherwise deployment failures skaffold encounters will immediately fail the deployment.  Defaults to 'false'

    --toot=false:
	Emit a terminal beep after the deploy is complete

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit

    --wait-for-deletions=true:
	Wait for pending deletions to complete before a deployment

    --wait-for-deletions-delay=2s:
	Delay between two checks for pending deletions

    --wait-for-deletions-max=1m0s:
	Max duration to wait for pending deletions
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold deploy [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_ARTIFACTS` (same as `--build-artifacts`)
- `SKAFFOLD_BUILD_CONCURRENCY` (same as `--build-concurrency`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_ENABLE_PLATFORM_NODE_AFFINITY` (same as `--enable-platform-node-affinity`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_HYDRATION_DIR` (same as `--hydration-dir`)
- `SKAFFOLD_IMAGES` (same as `--images`)
- `SKAFFOLD_ITERATIVE_STATUS_CHECK` (same as `--iterative-status-check`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_LOAD_IMAGES` (same as `--load-images`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_MUTE_LOGS` (same as `--mute-logs`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RESOURCE_SELECTOR_RULES_FILE` (same as `--resource-selector-rules-file`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_STATUS_CHECK_SELECTORS` (same as `--status-check-selectors`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_TAIL` (same as `--tail`)
- `SKAFFOLD_TOLERATE_FAILURES_UNTIL_DEADLINE` (same as `--tolerate-failures-until-deadline`)
- `SKAFFOLD_TOOT` (same as `--toot`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
- `SKAFFOLD_WAIT_FOR_DELETIONS` (same as `--wait-for-deletions`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_DELAY` (same as `--wait-for-deletions-delay`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_MAX` (same as `--wait-for-deletions-max`)
````

</details>

### skaffold dev

Run a pipeline in development mode

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --auto=false:
	Run with an auto-generated skaffold configuration. This will create a temporary `skaffold.yaml` file and kubernetes manifests necessary to run the application

    --auto-build=true:
	When set to false, builds wait for API request instead of running automatically

    --auto-create-config=true:
	If true, skaffold will try to create a config for the user's run if it doesn't find one

    --auto-deploy=true:
	When set to false, deploys wait for API request instead of running automatically

    --auto-sync=true:
	When set to false, syncs wait for API request instead of running automatically

    --build-concurrency=-1:
	Number of concurrently running builds. Set to 0 to run all builds in parallel. Doesn't violate build order among dependencies.

    --cache-artifacts=true:
	Set to false to disable default caching of artifacts

    --cache-file='':
	Specify the location of the cache file (default $HOME/.skaffold/cache)

    --check-cluster-node-platforms=true:
	When set to true, images are built for the target platforms matching the active kubernetes cluster node platforms. Enabled by default for `dev`, `debug` and `run`

    --cleanup=true:
	Delete deployments after dev or debug mode is interrupted

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --digest-source='':
	Set to 'remote' to skip builds and resolve the digest of images by tag from the remote registry. Set to 'local' to build images locally and use digests from built images. Set to 'tag' to use tags directly from the build. Set to 'none' to use tags directly from the Kubernetes manifests. If unspecified, defaults to 'remote' for remote clusters, and 'tag' for local clusters like kind or minikube.

    --disable-multi-platform-build=true:
	When set to true, forces only single platform image builds even when multiple target platforms are specified. Enabled by default for `dev` and `debug` modes, to keep dev-loop fast

    --enable-platform-node-affinity=true:
	If true, when deploying to a mixed node cluster, skaffold will add platform (os/arch) node affinity definition to rendered manifests based on the image platforms

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Recreate Kubernetes resources if necessary for deployment, warning: might cause downtime!

    --hydration-dir='.kpt-pipeline':
	The directory to where the (kpt) hydration takes place. Default to a hidden directory .kpt-pipeline.

    --insecure-registry=[]:
	Target registries for built images which are not secure

    --iterative-status-check=true:
	Run `status-check` iteratively after each deploy step, instead of all-together at the end of all deploys (default).

    --keep-running-on-failure=false:
	If true, the session will be suspended instead of ending if any errors occur, the user can fix the errors during the session suspension, the session can be restored and continued by pressing any key.

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --mute-logs=[]:
	mute logs for specified stages in pipeline (build, deploy, status-check, none, all)

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --no-prune=false:
	Skip removing images and containers built by Skaffold during cleanup after dev or debug mode

    --no-prune-children=false:
	Skip removing layers reused by Skaffold

    --platform=[]:
	The platform to target for the build artifacts

    --port-forward=user:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --resource-selector-rules-file='':
	Path to JSON file specifying the deny list of yaml objects for skaffold to NOT transform with 'image' and 'label' field replacements.  NOTE: this list is additive to skaffold's default denylist and denylist has priority over allowlist

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --skip-tests=false:
	Whether to skip the tests after building

    --status-check=:
	Wait for deployed resources to stabilize

    --status-check-selectors='':
	File containing resource selectors for kubernetes resources status check. A sample file looks like the following: {   "selectors":[     {       "group":"my.domain",       "kind":"MyCRD"     }     ] } The values of "group" and "kind" are regular expressions.

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --tail=true:
	Stream logs from deployed objects

    --tolerate-failures-until-deadline=false:
	Configures `status-check` to tolerate failures until Skaffold's statusCheckDeadline duration or the deployments progressDeadlineSeconds  Otherwise deployment failures skaffold encounters will immediately fail the deployment.  Defaults to 'false'

    --toot=false:
	Emit a terminal beep after the deploy is complete

    --trigger='notify':
	How is change detection triggered? (polling, notify, or manual)

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit

    --wait-for-deletions=true:
	Wait for pending deletions to complete before a deployment

    --wait-for-deletions-delay=2s:
	Delay between two checks for pending deletions

    --wait-for-deletions-max=1m0s:
	Max duration to wait for pending deletions

    -w, --watch-image=[]:
	Choose which artifacts to watch. Artifacts with image names that contain the expression will be watched only. Default is to watch sources for all artifacts

    -i, --watch-poll-interval=1000:
	Interval (in ms) between two checks for file changes
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold dev [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_AUTO` (same as `--auto`)
- `SKAFFOLD_AUTO_BUILD` (same as `--auto-build`)
- `SKAFFOLD_AUTO_CREATE_CONFIG` (same as `--auto-create-config`)
- `SKAFFOLD_AUTO_DEPLOY` (same as `--auto-deploy`)
- `SKAFFOLD_AUTO_SYNC` (same as `--auto-sync`)
- `SKAFFOLD_BUILD_CONCURRENCY` (same as `--build-concurrency`)
- `SKAFFOLD_CACHE_ARTIFACTS` (same as `--cache-artifacts`)
- `SKAFFOLD_CACHE_FILE` (same as `--cache-file`)
- `SKAFFOLD_CHECK_CLUSTER_NODE_PLATFORMS` (same as `--check-cluster-node-platforms`)
- `SKAFFOLD_CLEANUP` (same as `--cleanup`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_DIGEST_SOURCE` (same as `--digest-source`)
- `SKAFFOLD_DISABLE_MULTI_PLATFORM_BUILD` (same as `--disable-multi-platform-build`)
- `SKAFFOLD_ENABLE_PLATFORM_NODE_AFFINITY` (same as `--enable-platform-node-affinity`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_HYDRATION_DIR` (same as `--hydration-dir`)
- `SKAFFOLD_INSECURE_REGISTRY` (same as `--insecure-registry`)
- `SKAFFOLD_ITERATIVE_STATUS_CHECK` (same as `--iterative-status-check`)
- `SKAFFOLD_KEEP_RUNNING_ON_FAILURE` (same as `--keep-running-on-failure`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_MUTE_LOGS` (same as `--mute-logs`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_NO_PRUNE` (same as `--no-prune`)
- `SKAFFOLD_NO_PRUNE_CHILDREN` (same as `--no-prune-children`)
- `SKAFFOLD_PLATFORM` (same as `--platform`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RESOURCE_SELECTOR_RULES_FILE` (same as `--resource-selector-rules-file`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SKIP_TESTS` (same as `--skip-tests`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_STATUS_CHECK_SELECTORS` (same as `--status-check-selectors`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_TAIL` (same as `--tail`)
- `SKAFFOLD_TOLERATE_FAILURES_UNTIL_DEADLINE` (same as `--tolerate-failures-until-deadline`)
- `SKAFFOLD_TOOT` (same as `--toot`)
- `SKAFFOLD_TRIGGER` (same as `--trigger`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
- `SKAFFOLD_WAIT_FOR_DELETIONS` (same as `--wait-for-deletions`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_DELAY` (same as `--wait-for-deletions-delay`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_MAX` (same as `--wait-for-deletions-max`)
- `SKAFFOLD_WATCH_IMAGE` (same as `--watch-image`)
- `SKAFFOLD_WATCH_POLL_INTERVAL` (same as `--watch-poll-interval`)
````

</details>

### skaffold diagnose

Run a diagnostic on Skaffold

<details>
<summary>Examples</summary>

```text
# Search for configuration issues and print the effective configuration
  skaffold diagnose

  # Print the effective skaffold.yaml configuration for given profile
  skaffold diagnose --yaml-only --profile PROFILE
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    --enable-templating=false:
	Render supported templated fields with golang template engine

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -o, --output='':
	File to write diagnose result

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --sync-remote-cache='missing':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    --yaml-only=false:
	Only prints the effective skaffold.yaml configuration
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold diagnose [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_ENABLE_TEMPLATING` (same as `--enable-templating`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_OUTPUT` (same as `--output`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_YAML_ONLY` (same as `--yaml-only`)
````

</details>

### skaffold exec

Execute a custom action

<details>
<summary>Examples</summary>

```text
# Execute a defined action
  skaffold exec <action-name>

  # Execute a defined action that uses an image built from Skaffold. First, build the images
  skaffold build --file-output=build.json

  # Then use the built artifacts
  skaffold exec <action-name> --build-artifacts=build.json
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -a, --build-artifacts=:
	File containing pre-built images to use instead of rebuilding artifacts. A sample file looks like the following: {   "builds":[     {       "imageName":"registry/image1",       "tag":"registry/image1:tag"     },{       "imageName":"registry/image2",       "tag":"registry/image2:tag"     }] } The build result from a previous 'skaffold build --file-output' run can be used here

    -d, --default-repo='':
	Default repository value (overrides global config)

    --docker-network='':
	Name of an existing docker network to use when running the verify tests. If not specified, Skaffold will create a new network to use of the form 'skaffold-network-<uuid>'

    --env-file='':
	File containing env var key-value pairs that will be set in all verify container envs

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --port-forward=off:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold exec [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_ARTIFACTS` (same as `--build-artifacts`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DOCKER_NETWORK` (same as `--docker-network`)
- `SKAFFOLD_ENV_FILE` (same as `--env-file`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
````

</details>

### skaffold fix

Update old configuration to a newer schema version

<details>
<summary>Examples</summary>

```text
# Update "skaffold.yaml" in the current folder to the latest version
  skaffold fix

  # Update "skaffold.yaml" in the current folder to version "skaffold/v1"
  skaffold fix --version skaffold/v1

  # Update "skaffold.yaml" in the current folder in-place
  skaffold fix --overwrite

  # Update "skaffold.yaml" and write the output to a new file
  skaffold fix --output skaffold.new.yaml
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -o, --output='':
	File to write the changed config (instead of standard output)

    --overwrite=false:
	Overwrite original config with fixed config

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --sync-remote-cache='missing':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    --version='skaffold/v4beta14':
	Target schema version to upgrade to
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold fix [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_OUTPUT` (same as `--output`)
- `SKAFFOLD_OVERWRITE` (same as `--overwrite`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_VERSION` (same as `--version`)
````

</details>

### skaffold init

Generate configuration for deploying an application

<details>
<summary>Options</summary>

```text
--analyze=false:
	Print all discoverable Dockerfiles and images in JSON format to stdout

    -a, --artifact=[]:
	'='-delimited Dockerfile/image pair, or JSON string, to generate build artifact (example: --artifact='{"builder":"Docker","payload":{"path":"/web/Dockerfile.web"},"image":"gcr.io/web-project/image"}')

    --assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --compose-file='':
	Initialize from a docker-compose file

    --default-kustomization='':
	Default Kustomization overlay path (others will be added as profiles)

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Force the generation of the Skaffold config

    --generate-manifests=false:
	Allows skaffold to try and generate basic kubernetes resources to get your project started

    -k, --kubernetes-manifest=[]:
	A path or a glob pattern to kubernetes manifests (can be non-existent) to be added to the kubectl deployer (overrides detection of kubernetes manifests). Repeat the flag for multiple entries. E.g.: skaffold init -k pod.yaml -k k8s/*.yml

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --skip-build=false:
	Skip generating build artifacts in Skaffold config

    --skip-unreachable-dirs=false:
	Instead of erroring, it will skip the directories that cannot be accessed due to permissions

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold init [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ANALY
````

</details>

ZE`(same as`--analyze`)

- `SKAFFOLD_ARTIFACT` (same as `--artifact`)
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_COMPOSE_FILE` (same as `--compose-file`)
- `SKAFFOLD_DEFAULT_KUSTOMIZATION` (same as `--default-kustomization`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_GENERATE_MANIFESTS` (same as `--generate-manifests`)
- `SKAFFOLD_KUBERNETES_MANIFEST` (same as `--kubernetes-manifest`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_SKIP_BUILD` (same as `--skip-build`)
- `SKAFFOLD_SKIP_UNREACHABLE_DIRS` (same as `--skip-unreachable-dirs`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)

### skaffold options

<details>
<summary>The following options can be passed to any command</summary>

```text
--color=34:
	Specify the default output color in ANSI escape codes

    --interactive=true:
	Allow user prompts for more information

    --timestamps=false:
	Print timestamps in logs

    --update-check=true:
	Check for a more recent version of Skaffold

    -v, --verbosity='warning':
	Log level: one of [panic fatal error warning info debug trace]
```

</details>

### skaffold render

Generate rendered Kubernetes manifests

<details>
<summary>Examples</summary>

```text
# Hydrate Kubernetes manifests without building the images, using digest resolved from tag in remote registry
  skaffold render --digest-source=remote
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -a, --build-artifacts=:
	File containing pre-built images to use instead of rebuilding artifacts. A sample file looks like the following: {   "builds":[     {       "imageName":"registry/image1",       "tag":"registry/image1:tag"     },{       "imageName":"registry/image2",       "tag":"registry/image2:tag"     }] } The build result from a previous 'skaffold build --file-output' run can be used here

    --cache-artifacts=true:
	Set to false to disable default caching of artifacts

    -d, --default-repo='':
	Default repository value (overrides global config)

    --digest-source='':
	Set to 'remote' to skip builds and resolve the digest of images by tag from the remote registry. Set to 'local' to build images locally and use digests from built images. Set to 'tag' to use tags directly from the build. Set to 'none' to use tags directly from the Kubernetes manifests. If unspecified, defaults to 'remote' for remote clusters, and 'tag' for local clusters like kind or minikube.

    --enable-platform-node-affinity=false:
	If true, when deploying to a mixed node cluster, skaffold will add platform (os/arch) node affinity definition to rendered manifests based on the image platforms

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --hydration-dir='.kpt-pipeline':
	The directory to where the (kpt) hydration takes place. Default to a hidden directory .kpt-pipeline.

    -i, --images=:
	A list of pre-built images to deploy, either tagged images or NAME=TAG pairs

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    --loud=false:
	Show the build logs and output

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --offline=false:
	Do not connect to Kubernetes API server for manifest creation and validation. This is helpful when no Kubernetes cluster is available (e.g. GitOps model). No metadata.namespace attribute is injected in this case - the manifest content does not get changed.

    -o, --output='':
	File to write rendered manifests to

    --platform=[]:
	The platform to target for the build artifacts

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --resource-selector-rules-file='':
	Path to JSON file specifying the deny list of yaml objects for skaffold to NOT transform with 'image' and 'label' field replacements.  NOTE: this list is additive to skaffold's default denylist and denylist has priority over allowlist

    --set=[]:
	overrides templated manifest fields by provided key-value pairs

    --set-value-file='':
	overrides templated manifest fields by a file containing key-value pairs in .env file format

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold render [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_ARTIFACTS` (same as `--build-artifacts`)
- `SKAFFOLD_CACHE_ARTIFACTS` (same as `--cache-artifacts`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DIGEST_SOURCE` (same as `--digest-source`)
- `SKAFFOLD_ENABLE_PLATFORM_NODE_AFFINITY` (same as `--enable-platform-node-affinity`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_HYDRATION_DIR` (same as `--hydration-dir`)
- `SKAFFOLD_IMAGES` (same as `--images`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_LOUD` (same as `--loud`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_OFFLINE` (same as `--offline`)
- `SKAFFOLD_OUTPUT` (same as `--output`)
- `SKAFFOLD_PLATFORM` (same as `--platform`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RESOURCE_SELECTOR_RULES_FILE` (same as `--resource-selector-rules-file`)
- `SKAFFOLD_SET` (same as `--set`)
- `SKAFFOLD_SET_VALUE_FILE` (same as `--set-value-file`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
````

</details>

### skaffold run

Run a pipeline

<details>
<summary>Examples</summary>

```text
# Build, test, deploy and tail the logs
  skaffold run --tail

  # Run with a given profile
  skaffold run -p <profile>
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    --auto=false:
	Run with an auto-generated skaffold configuration. This will create a temporary `skaffold.yaml` file and kubernetes manifests necessary to run the application

    --auto-create-config=true:
	If true, skaffold will try to create a config for the user's run if it doesn't find one

    --build-concurrency=-1:
	Number of concurrently running builds. Set to 0 to run all builds in parallel. Doesn't violate build order among dependencies.

    -b, --build-image=[]:
	Only build artifacts with image names that contain the given substring. Default is to build sources for all artifacts

    --cache-artifacts=true:
	Set to false to disable default caching of artifacts

    --cache-file='':
	Specify the location of the cache file (default $HOME/.skaffold/cache)

    --check-cluster-node-platforms=true:
	When set to true, images are built for the target platforms matching the active kubernetes cluster node platforms. Enabled by default for `dev`, `debug` and `run`

    --cleanup=true:
	Delete deployments after dev or debug mode is interrupted

    --cloud-run-location='':
	The GCP Region to deploy Cloud Run services to

    --cloud-run-project='':
	The GCP Project ID or Project Number to deploy for Cloud Run

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -d, --default-repo='':
	Default repository value (overrides global config)

    --detect-minikube=true:
	Use heuristics to detect a minikube cluster

    --digest-source='':
	Set to 'remote' to skip builds and resolve the digest of images by tag from the remote registry. Set to 'local' to build images locally and use digests from built images. Set to 'tag' to use tags directly from the build. Set to 'none' to use tags directly from the Kubernetes manifests. If unspecified, defaults to 'remote' for remote clusters, and 'tag' for local clusters like kind or minikube.

    --disable-multi-platform-build=false:
	When set to true, forces only single platform image builds even when multiple target platforms are specified. Enabled by default for `dev` and `debug` modes, to keep dev-loop fast

    --enable-platform-node-affinity=true:
	If true, when deploying to a mixed node cluster, skaffold will add platform (os/arch) node affinity definition to rendered manifests based on the image platforms

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    --force=false:
	Recreate Kubernetes resources if necessary for deployment, warning: might cause downtime!

    --hydration-dir='.kpt-pipeline':
	The directory to where the (kpt) hydration takes place. Default to a hidden directory .kpt-pipeline.

    --insecure-registry=[]:
	Target registries for built images which are not secure

    --iterative-status-check=true:
	Run `status-check` iteratively after each deploy step, instead of all-together at the end of all deploys (default).

    --kube-context='':
	Deploy to this Kubernetes context

    --kubeconfig='':
	Path to the kubeconfig file to use for CLI requests.

    -l, --label=[]:
	Add custom labels to deployed objects. Set multiple times for multiple labels

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    --mute-logs=[]:
	mute logs for specified stages in pipeline (build, deploy, status-check, none, all)

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --no-prune=false:
	Skip removing images and containers built by Skaffold during cleanup after dev or debug mode

    --no-prune-children=false:
	Skip removing layers reused by Skaffold

    --platform=[]:
	The platform to target for the build artifacts

    --port-forward=off:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --resource-selector-rules-file='':
	Path to JSON file specifying the deny list of yaml objects for skaffold to NOT transform with 'image' and 'label' field replacements.  NOTE: this list is additive to skaffold's default denylist and denylist has priority over allowlist

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --skip-tests=false:
	Whether to skip the tests after building

    --status-check=:
	Wait for deployed resources to stabilize

    --status-check-selectors='':
	File containing resource selectors for kubernetes resources status check. A sample file looks like the following: {   "selectors":[     {       "group":"my.domain",       "kind":"MyCRD"     }     ] } The values of "group" and "kind" are regular expressions.

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    -t, --tag='':
	The optional custom tag to use for images which overrides the current Tagger configuration

    --tail=false:
	Stream logs from deployed objects

    --tolerate-failures-until-deadline=false:
	Configures `status-check` to tolerate failures until Skaffold's statusCheckDeadline duration or the deployments progressDeadlineSeconds  Otherwise deployment failures skaffold encounters will immediately fail the deployment.  Defaults to 'false'

    --toot=false:
	Emit a terminal beep after the deploy is complete

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit

    --wait-for-deletions=true:
	Wait for pending deletions to complete before a deployment

    --wait-for-deletions-delay=2s:
	Delay between two checks for pending deletions

    --wait-for-deletions-max=1m0s:
	Max duration to wait for pending deletions
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold run [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_AUTO` (same as `--auto`)
- `SKAFFOLD_AUTO_CREATE_CONFIG` (same as `--auto-create-config`)
- `SKAFFOLD_BUILD_CONCURRENCY` (same as `--build-concurrency`)
- `SKAFFOLD_BUILD_IMAGE` (same as `--build-image`)
- `SKAFFOLD_CACHE_ARTIFACTS` (same as `--cache-artifacts`)
- `SKAFFOLD_CACHE_FILE` (same as `--cache-file`)
- `SKAFFOLD_CHECK_CLUSTER_NODE_PLATFORMS` (same as `--check-cluster-node-platforms`)
- `SKAFFOLD_CLEANUP` (same as `--cleanup`)
- `SKAFFOLD_CLOUD_RUN_LOCATION` (same as `--cloud-run-location`)
- `SKAFFOLD_CLOUD_RUN_PROJECT` (same as `--cloud-run-project`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DETECT_MINIKUBE` (same as `--detect-minikube`)
- `SKAFFOLD_DIGEST_SOURCE` (same as `--digest-source`)
- `SKAFFOLD_DISABLE_MULTI_PLATFORM_BUILD` (same as `--disable-multi-platform-build`)
- `SKAFFOLD_ENABLE_PLATFORM_NODE_AFFINITY` (same as `--enable-platform-node-affinity`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_FORCE` (same as `--force`)
- `SKAFFOLD_HYDRATION_DIR` (same as `--hydration-dir`)
- `SKAFFOLD_INSECURE_REGISTRY` (same as `--insecure-registry`)
- `SKAFFOLD_ITERATIVE_STATUS_CHECK` (same as `--iterative-status-check`)
- `SKAFFOLD_KUBE_CONTEXT` (same as `--kube-context`)
- `SKAFFOLD_KUBECONFIG` (same as `--kubeconfig`)
- `SKAFFOLD_LABEL` (same as `--label`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_MUTE_LOGS` (same as `--mute-logs`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_NO_PRUNE` (same as `--no-prune`)
- `SKAFFOLD_NO_PRUNE_CHILDREN` (same as `--no-prune-children`)
- `SKAFFOLD_PLATFORM` (same as `--platform`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RESOURCE_SELECTOR_RULES_FILE` (same as `--resource-selector-rules-file`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SKIP_TESTS` (same as `--skip-tests`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_STATUS_CHECK_SELECTORS` (same as `--status-check-selectors`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_TAG` (same as `--tag`)
- `SKAFFOLD_TAIL` (same as `--tail`)
- `SKAFFOLD_TOLERATE_FAILURES_UNTIL_DEADLINE` (same as `--tolerate-failures-until-deadline`)
- `SKAFFOLD_TOOT` (same as `--toot`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
- `SKAFFOLD_WAIT_FOR_DELETIONS` (same as `--wait-for-deletions`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_DELAY` (same as `--wait-for-deletions-delay`)
- `SKAFFOLD_WAIT_FOR_DELETIONS_MAX` (same as `--wait-for-deletions-max`)
````

</details>

### skaffold schema

List JSON schemas used to validate skaffold.yaml configuration

<details>
<summary>Available Commands</summary>

```text
get           Print a given skaffold.yaml's json schema

Use "skaffold schema <command> --help" for more information about a given command.
```

</details>

### skaffold schema get

Print a given skaffold.yaml's json schema

<details>
<summary>Examples</summary>

```text
# Print the schema in version `skaffold/v1`
  skaffold schema get skaffold/v1
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold schema get [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).
```

</details>

### skaffold test

Run tests against your built application images

<details>
<summary>Examples</summary>

```text
# Build the artifacts and collect the tags into a file
  skaffold build --file-output=tags.json

  # Run test against images previously built by Skaffold into a 'tags.json' file
  skaffold test --build-artifacts=tags.json
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -a, --build-artifacts=:
	File containing pre-built images to use instead of rebuilding artifacts. A sample file looks like the following: {   "builds":[     {       "imageName":"registry/image1",       "tag":"registry/image1:tag"     },{       "imageName":"registry/image2",       "tag":"registry/image2:tag"     }] } The build result from a previous 'skaffold build --file-output' run can be used here

    -c, --config='':
	File for global configurations (defaults to $HOME/.skaffold/config)

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    -i, --images=:
	A list of pre-built images to deploy, either tagged images or NAME=TAG pairs

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.

    --wait-for-connection=false:
	Blocks ending execution of skaffold until the /v2/events gRPC/HTTP endpoint is hit
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold test [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_ARTIFACTS` (same as `--build-artifacts`)
- `SKAFFOLD_CONFIG` (same as `--config`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_IMAGES` (same as `--images`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
- `SKAFFOLD_WAIT_FOR_CONNECTION` (same as `--wait-for-connection`)
````

</details>

### skaffold verify

Run verification tests against skaffold deployments

<details>
<summary>Examples</summary>

```text
# Deploy with skaffold and then verify deployments
  skaffold deploy -q | skaffold verify
```

</details>

<details>
<summary>Options</summary>

```text
--assume-yes=false:
	If true, skaffold will skip yes/no confirmation from the user and default to yes

    -a, --build-artifacts=:
	File containing pre-built images to use instead of rebuilding artifacts. A sample file looks like the following: {   "builds":[     {       "imageName":"registry/image1",       "tag":"registry/image1:tag"     },{       "imageName":"registry/image2",       "tag":"registry/image2:tag"     }] } The build result from a previous 'skaffold build --file-output' run can be used here

    -d, --default-repo='':
	Default repository value (overrides global config)

    --docker-network='':
	Name of an existing docker network to use when running the verify tests. If not specified, Skaffold will create a new network to use of the form 'skaffold-network-<uuid>'

    --env-file='':
	File containing env var key-value pairs that will be set in all verify container envs

    -f, --filename='skaffold.yaml':
	Path or URL to the Skaffold config file

    -m, --module=[]:
	Filter Skaffold configs to only the provided named modules

    -n, --namespace='':
	Runs deployments in the specified namespace. When used with 'render' command, renders manifests contain the namespace

    --port-forward=off:
	Port-forward exposes service ports and container ports within pods and other resources (off, user, services, debug, pods)

    -p, --profile=[]:
	Activate profiles by name (prefixed with `-` to disable a profile)

    --profile-auto-activation=true:
	Set to false to disable profile auto activation

    --propagate-profiles=true:
	Setting '--propagate-profiles=false' disables propagating profiles set by the '--profile' flag across config dependencies. This mean that only profiles defined directly in the target 'skaffold.yaml' file are activated.

    --remote-cache-dir='':
	Specify the location of the remote cache (default $HOME/.skaffold/remote-cache)

    --rpc-http-port=:
	tcp port to expose the Skaffold API over HTTP REST

    --rpc-port=:
	tcp port to expose the Skaffold API over gRPC

    --status-check=:
	Wait for deployed resources to stabilize

    --sync-remote-cache='always':
	Controls how Skaffold manages the remote config cache (see `remote-cache-dir`). One of `always` (default), `missing`, or `never`. `always` syncs remote repositories to latest on access. `missing` only clones remote repositories if they do not exist locally. `never` means the user takes responsibility for updating remote repositories.
```

</details>

<details>
<summary>Usage</summary>

```text
skaffold verify [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

````

</details>

<details>
<summary>Env vars</summary>

```text
- `SKAFFOLD_ASSUME_YES` (same as `--assume-yes`)
- `SKAFFOLD_BUILD_ARTIFACTS` (same as `--build-artifacts`)
- `SKAFFOLD_DEFAULT_REPO` (same as `--default-repo`)
- `SKAFFOLD_DOCKER_NETWORK` (same as `--docker-network`)
- `SKAFFOLD_ENV_FILE` (same as `--env-file`)
- `SKAFFOLD_FILENAME` (same as `--filename`)
- `SKAFFOLD_MODULE` (same as `--module`)
- `SKAFFOLD_NAMESPACE` (same as `--namespace`)
- `SKAFFOLD_PORT_FORWARD` (same as `--port-forward`)
- `SKAFFOLD_PROFILE` (same as `--profile`)
- `SKAFFOLD_PROFILE_AUTO_ACTIVATION` (same as `--profile-auto-activation`)
- `SKAFFOLD_PROPAGATE_PROFILES` (same as `--propagate-profiles`)
- `SKAFFOLD_REMOTE_CACHE_DIR` (same as `--remote-cache-dir`)
- `SKAFFOLD_RPC_HTTP_PORT` (same as `--rpc-http-port`)
- `SKAFFOLD_RPC_PORT` (same as `--rpc-port`)
- `SKAFFOLD_STATUS_CHECK` (same as `--status-check`)
- `SKAFFOLD_SYNC_REMOTE_CACHE` (same as `--sync-remote-cache`)
````

</details>

### skaffold version

Print the version information

```


Options:
    -o, --output={{.Version}}
	: Format output with go-template. For full struct documentation, see https://godoc.org/github.com/GoogleContainerTools/skaffold/v2/pkg/skaffold/version#Info

Usage:
  skaffold version [options]

Use "skaffold options" for a list of global command-line options (applies to all commands).


```

Env vars:

- `SKAFFOLD_OUTPUT` (same as `--output`)

## renderers

<details>
<summary>Related Documents for renderers</summary>

- [helm.md](./renderers/helm.md)
- [kpt.md](./renderers/kpt.md)
- [kustomize.md](./renderers/kustomize.md)
- [rawYaml.md](./renderers/rawYaml.md)

</details>

[/docs/how-tos/renderers, /docs/pipeline-stages/renderers/] no_list: true

When Skaffold renders your application to Kubernetes, it goes through the following process:

- the Skaffold renderer _renders_ the final Kubernetes manifests: Skaffold replaces untagged image
  names in the Kubernetes manifests with the final tagged image names. It also might go through the
  extra intermediate step of expanding templates (for helm) or calculating overlays (for kustomize).

### Supported renderers

Skaffold supports the following tools for rendering applications:

- [`rawYaml`](./rawYaml.md) - use this if you don't currently use a rendering tool
- [`helm`](./helm.md)
- [`kpt`](./kpt.md)
- [`kustomize`](./kustomize.md)

Skaffold's render configuration is set through the `manifests` section of the `skaffold.yaml`. See
each renderer's page for more information on how to configure them for use in Skaffold. It's also
possible to use a combination of multiple renderers in a single project.

For a detailed discussion on Skaffold configuration, see [Skaffold Concepts](design/config.md) and
[skaffold.yaml References](references/yaml.md).

## resources

## Community

Join the Skaffold community and discuss the project at:

- StackOverflow using the [`skaffold` tag](https://stackoverflow.com/questions/tagged/skaffold)
- The [Skaffold Mailing List]
- The [#Skaffold channel](https://kubernetes.slack.com/messages/CABQMSZA6/) on the Kubernetes Slack
  (sign up at [slack.k8s.io](https://slack.k8s.io))
- [Give us feedback](feedback)!

The Skaffold Project also holds a monthly meeting on the last Wednesday of the month at 9:30am PST
on [Google Meet](https://meet.google.com/tje-kwpx-ixv)! Everyone is welcome to attend! You will
receive a calendar invite when you join the [Skaffold Mailing List].

[Skaffold Mailing List]: https://groups.google.com/forum#!forum/skaffold-users

## Contributing

See
[Contributing Guide](https://github.com/GoogleContainerTools/skaffold/blob/main/CONTRIBUTING.md),
[Developing Guide](https://github.com/GoogleContainerTools/skaffold/blob/main/DEVELOPMENT.md), and
our [Code of Conduct](https://github.com/GoogleContainerTools/skaffold/blob/main/code-of-conduct.md)
on GitHub.

## Release Notes

See [Release Notes](https://github.com/GoogleContainerTools/skaffold/blob/main/CHANGELOG.md) on
Github.

## Roadmap

See our roadmap [in GitHub](https://github.com/GoogleContainerTools/skaffold/blob/main/ROADMAP.md).

## feedback

Your feedback is very important to us, and a critical part of making Skaffold the best it can be!
There are a few easy ways to make your voice heard.

## Quick Survey

Take our [quick 5-question survey](https://forms.gle/BMTbGQXLWSdn7vEs6) to tell us how satisfied you
are with Skaffold, and what improvements you think we should make.

## Skaffold Feedback Session

The Skaffold team actively incorporates user feedback into the product as it evolves. We're always
looking to have conversations with developers like you to learn about the different ways you use
Skaffold, and what improvements you think we can make to better suit your workflow.

**What is a feedback session?**

We periodically schedule hour long video conference sessions with both individual developers and
teams to get more personalized feedback. If you're interested in talking with us, fill out our
[feedback form](https://forms.gle/J5h567ncypY2ziq49), and we'll schedule a session at a time
convenient for you. No preparation is needed!

> [!NOTE] Providing your information does not guarantee that we will contact you.

If at any time you wish to opt out of communications from the Skaffold team, you can fill out our
[opt out form](https://forms.gle/cnfCXotenyUtF92w6).

## telemetry

<script type="module" src="main.js"></script>

To help prioritize features and work on improving Skaffold, we collect anonymized Skaffold usage
data. Usage data does not include any argument values or personal information.

You are _opted-in_ by default and you can opt-out at any time with the `skaffold config` command. In
order to disable sending usage data, run the following command after you have installed Skaffold:

```bash
skaffold config set --global collect-metrics false
```

The breakdown of data we collect is as follows:

<ul id="metrics-list"></ul>

#### Example

<details>
<summary>View Example</summary>

#### Example

```bash
skaffold dev -v trace --port-forward --cache-artifacts=false --filename=./skaffold.yaml
```

Running the above in the
[microservices example](https://github.com/GoogleContainerTools/skaffold/tree/main/examples/microservices)
after a couple of builds/deploys results in the following metrics being collected:

```json
[
  {
    "ExitCode": 0,
    "BuildArtifacts": 3,
    "Command": "dev",
    "Version": "v1.19.0",
    "OS": "darwin",
    "Arch": "amd64",
    "PlatformType": "local",
    "Deployers": ["kubectl"],
    "EnumFlags": {
      "cache-artifacts": "false",
      "port-forward": "true"
    },
    "Builders": {
      "docker": 3
    },
    "SyncType": {},
    "DevIterations": [
      {
        "Intent": "build",
        "ErrorCode": 0
      },
      {
        "Intent": "build",
        "ErrorCode": 104
      },
      {
        "Intent": "build",
        "ErrorCode": 0
      },
      {
        "Intent": "deploy",
        "ErrorCode": 300
      },
      {
        "Intent": "deploy",
        "ErrorCode": 0
      }
    ],
    "StartTime": "2021-01-25T16:24:38.615012-05:00",
    "Duration": 176315222939,
    "ErrorCode": 0
  }
]
```

This data is handled in accordance with our privacy policy
[https://policies.google.com/privacy](https://policies.google.com/privacy).

</details>

## testers

<details>
<summary>Related Documents for testers</summary>

- [custom.md](./testers/custom.md)
- [structure.md](./testers/structure.md)

</details>

/docs/pipeline-stages/testers/] no_list: true

Skaffold has an integrated testing phase between the build and deploy phases of the pipeline.
Skaffold supports the below types of tests.

| Skaffold testers                                 | Description                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Custom Test](testers/custom.md)                 | Enables users to run custom commands in the testing phase of the Skaffold pipeline      |
| [Container Structure Test](testers/structure.md) | Enables users to validate built container images before deploying them to their cluster |

## tutorials

<details>
<summary>Related Documents for tutorials</summary>

- [artifact-dependencies.md](./tutorials/artifact-dependencies.md)
- [build-and-deploy-to-kubernetes.md](./tutorials/build-and-deploy-to-kubernetes.md)
- [buildpacks-override.md](./tutorials/buildpacks-override.md)
- [ci_cd.md](./tutorials/ci_cd.md)
- [config-dependencies.md](./tutorials/config-dependencies.md)
- [custom-builder.md](./tutorials/custom-builder.md)
- [developer-journey.md](./tutorials/developer-journey.md)
- [go-integration-coverage.md](./tutorials/go-integration-coverage.md)
- [skaffold-resource-selector.md](./tutorials/skaffold-resource-selector.md)

</details>

See the [Github Examples page](https://github.com/GoogleContainerTools/skaffold/tree/main/examples)
for more examples.

> [!NOTE] When deploying to a remote cluster you have to point Skaffold to your default image
> repository in one of the four ways:
>
> 1.  flag: `skaffold dev --default-repo <myrepo>`
> 1.  env var: `SKAFFOLD_DEFAULT_REPO=<myrepo> skaffold dev`
> 1.  global skaffold config (one time): `skaffold config set --global default-repo <myrepo>`
> 1.  skaffold config for current kubectl context: `skaffold config set default-repo <myrepo>`

## upgrading

Skaffold v2 [NEW]" weight: 10 aliases: [/docs/upgrading-to-v2]

In Skaffold v2 what was previously the `deploy` phase of Skaffold is now split into a new `render`
phase and `deploy` phase. This clear boundary of separation between render and deploy phases allowed
the team to simplify our code and CLI allowing us to clean up previously confusing or redundant
flags like `skaffold deploy --render-only`, `skaffold deploy --skip-render`. This release comes with
a new schema version `v3alpha1`. This schema introduced a new `manifests` section which declares all
resources an application deploys e.g helm charts, kubernetes yaml, kustomize directories and kpt
configuration. This decoupling of manifests declaration from the deploy section allows manifests to
be used across deploy tools e.g.

- you can configure kpt deployer to render and apply kubernetes yaml, helm charts or
- you can configure the kubectl deployer to apply helm charts and helm to render the charts.

Upgrading from skaffold `v1.*.*` to skaffold `v2.0.0-beta3` should not require any manual
skaffold.yaml changes or CLI command modification for most common use cases. Skaffold `v2` includes
the same CLI surface as `v1` and has backwards compatibility for all previous skaffold.yaml schema
`apiVersion` for example - `v2beta*`, `v1beta*` and `v1alpha*`.

If you wish to update your skaffold.yaml to the latest `apiVersion` (`apiVersion: v3alpha1`) run
`skaffold fix` which will output an updated skaffold.yaml with the schema fields updated for
`v3alpha1`. With this new `v3alpha1` configuration schema you can access the new v2 functionality
via the `v3alpha1` configuration fields [here](references/yaml.md#manifests) Example usage of
`skaffold fix`:

```console
$ cat skaffold.yaml | head -1
apiVersion: skaffold/v2beta29
$ skaffold fix
apiVersion: skaffold/v3alpha1
kind: Config
build:
  artifacts:
  - image: skaffold-example
manifests:
  rawYaml:
  - k8s-*
deploy:
  kubectl: {}
```

The list of features that were supported in skaffold `v1` but are no longer support or require
manual changes for `v2.0.0-beta3` include:

- `v1` `kpt` deployer usage is not upgradeable via `skaffold fix` given the numerous changes made to
  the `kpt` workflow. Manual changes might be required to get users pipelines working as expected.
- using multiple renderers WITH the `kpt` deployer being one of them (using combinations of any
  other renderer(s) works as it did previously).

Outside of the above, there are currently no known other regressions when migrating from skaffold v1
-> v2 but areas that are most likely to have possible issues/incompitibility include:

- `helm` renderer/deployer usage (see [helm docs](renderers/helm.md) for more details)
- v1 `kpt` deployer usage
- `skaffold render` flags usage (see [render docs](renderers.md) and
  [render schema](references/yaml.md#manifests) for more details)

If you encounter any issues using skaffold `v2.0.0-beta3`, particularly any regressions that used to
work differently or succeed in `v1`, please file an issue at
[GoogleContainerTools/skaffold](https://github.com/GoogleContainerTools/skaffold/issues).

## workflows

<details>
<summary>Related Documents for workflows</summary>

- [ci-cd.md](./workflows/ci-cd.md)
- [debug.md](./workflows/debug.md)
- [dev.md](./workflows/dev.md)
- [getting-started-with-your-project.md](./workflows/getting-started-with-your-project.md)
- [handling-platforms.md](./workflows/handling-platforms.md)

</details>

[/docs/how-tos,/docs/concepts/workflow,/docs/concepts/modes] simple_list: true

> [!NOTE] If you're [running Skaffold through Cloud Code](../install/intro.md#managed-ide) then you
> can additionally checkout these guides:
>
> - [how-to guides for Cloud Code for VSCode](https://cloud.google.com/code/docs/vscode/how-to)
> - [how-to guides for Cloud Code for Intellij](https://cloud.google.com/code/docs/intellij/how-to)

<details>
<summary>General References</summary>

- [cleanup.md](./cleanup.md)
- [custom-actions.md](./custom-actions.md)
- [filesync.md](./filesync.md)
- [init.md](./init.md)
- [lifecycle-hooks.md](./lifecycle-hooks.md)
- [log-tailing.md](./log-tailing.md)
- [port-forwarding.md](./port-forwarding.md)
- [status-check.md](./status-check.md)
- [taggers.md](./taggers.md)
- [verify.md](./verify.md)

</details>
