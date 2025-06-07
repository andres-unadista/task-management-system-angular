import { RenderMode, ServerRoute } from '@angular/ssr';

const routesIDs: string[] = [
  '1',
  '2',
  ];

/**
 * Defines server-side routes with prerendering configurations.
 * 
 * - The 'task/:id_project' route uses prerendering with specific parameters
 *   obtained asynchronously from `getPrerenderParams()`. It maps `routesIDs`
 *   to dynamic route segments.
 * 
 * - The '**' route serves as a catch-all wildcard route, also leveraging 
 *   prerendering.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'task/:id_project',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id_project => ({ id_project }));
   },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
