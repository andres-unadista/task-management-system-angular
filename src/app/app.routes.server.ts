import { RenderMode, ServerRoute } from '@angular/ssr';

const routesIDs: string[] = [
  'custom-id1',
  'custom-id2',
  ];

export const serverRoutes: ServerRoute[] = [
  {
    path: 'task/:id_project',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
   },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
