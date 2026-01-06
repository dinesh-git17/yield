/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js at startup.
 * Used to initialize Sentry for server-side and edge runtimes.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = async (
  error: { digest: string } & Error,
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
    revalidateReason: "on-demand" | "stale" | undefined;
    renderSource: "react-server-components" | "react-server-components-payload" | undefined;
  }
) => {
  const { captureException } = await import("@sentry/nextjs");

  captureException(error, {
    tags: {
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    },
    extra: {
      method: request.method,
      path: request.path,
      digest: error.digest,
      revalidateReason: context.revalidateReason,
      renderSource: context.renderSource,
    },
  });
};
