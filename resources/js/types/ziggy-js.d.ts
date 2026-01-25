declare module "ziggy-js" {
  interface RouteParams {
    [key: string]: string | number | boolean
  }

  interface Ziggy {
    url: string
    port?: number
    defaults?: RouteParams
    routes: Record<
      string,
      {
        uri: string
        methods: string[]
        domain?: string
      }
    >
  }

  const route: (
    name: string,
    params?: RouteParams,
    absolute?: boolean,
    config?: Ziggy
  ) => string

  export default route
}
