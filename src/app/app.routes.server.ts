import { RenderMode, ServerRoute } from '@angular/ssr';

const routesIDs: string[] = [
  '1',
  '2',
  ];

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
