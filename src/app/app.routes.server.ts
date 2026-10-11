import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // MSAL needs browser APIs (window, localStorage), so skip server rendering/prerendering.
    path: '**',
    renderMode: RenderMode.Client,
  },
];
