FROM node:22-slim

RUN apt-get update && apt-get install -y libvips-dev && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable pnpm && corepack prepare pnpm@10.33.4 --activate

ENV NPM_CONFIG_ONLY_BUILT_DEPENDENCIES=esbuild,sharp
ENV PNPM_CONFIG_ONLY_BUILT_DEPENDENCIES=esbuild,sharp

WORKDIR /app

CMD ["pnpm", "dlx", "--allow-build=esbuild,sharp", "@penpot/mcp@2.15.4"]
