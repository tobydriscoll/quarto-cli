/*
* types.ts
*
* Copyright (C) 2020-2022 Posit Software, PBC
*
*/

import { RenderServices } from "../command/render/types.ts";
import { PandocFlags } from "../config/types.ts";
import { Format, FormatExtras } from "../config/types.ts";
import { mergeConfigs } from "../core/config.ts";
import { isRStudio } from "../core/platform.ts";
import { findOpenPort, kLocalhost, waitForPort } from "../core/port.ts";
import { TempContext } from "../core/temp-types.ts";

import {
  NavigationItem as NavItem,
  NavigationItemObject,
  NavigationItemObject as SidebarTool,
  ProjectConfig as ProjectConfig_Project,
  ProjectPreview,
} from "../resources/types/schema-types.ts";
export {
  type NavigationItem as NavItem,
  type NavigationItemObject,
  type NavigationItemObject as SidebarTool,
  type PageFooter as NavigationFooter,
  type ProjectPreview,
} from "../resources/types/schema-types.ts";

export const kProjectType = "type";
export const kProjectTitle = "title";
export const kProjectRender = "render";
export const kProjectPreRender = "pre-render";
export const kProjectPostRender = "post-render";
export const kProjectExecuteDir = "execute-dir";
export const kProjectOutputDir = "output-dir";
export const kProjectLibDir = "lib-dir";
export const kProjectResources = "resources";

export const kProjectWatchInputs = "watch-inputs";

export interface ProjectContext {
  dir: string;
  engines: string[];
  files: ProjectFiles;
  config?: ProjectConfig;
  formatExtras?: (
    project: ProjectContext,
    source: string,
    flags: PandocFlags,
    format: Format,
    services: RenderServices,
  ) => Promise<FormatExtras>;
}

export interface ProjectFiles {
  input: string[];
  resources?: string[];
  config?: string[];
  configResources?: string[];
}

export interface ProjectConfig {
  project: ProjectConfig_Project;
  [key: string]: unknown;
}

export async function resolvePreviewOptions(
  options: ProjectPreview,
  project?: ProjectContext,
): Promise<ProjectPreview> {
  // start with project options if we have them
  if (project?.config?.project.preview) {
    options = mergeConfigs(project.config.project.preview, options);
  }
  // provide defaults
  const resolved = mergeConfigs({
    host: kLocalhost,
    browser: true,
    [kProjectWatchInputs]: !isRStudio(),
    timeout: 0,
    navigate: true,
  }, options) as ProjectPreview;

  // if a specific port is requested then wait for it up to 5 seconds
  if (resolved.port) {
    if (!await waitForPort({ port: resolved.port, hostname: resolved.host })) {
      throw new Error(`Requested port ${options.port} is already in use.`);
    }
  } else {
    resolved.port = findOpenPort();
  }

  return resolved;
}

export const kProject404File = "404.html";

export type LayoutBreak = "" | "sm" | "md" | "lg" | "xl" | "xxl";

export const kAriaLabel = "aria-label";
export const kCollapseLevel = "collapse-level";
export const kCollapseBelow = "collapse-below";
export const kLogoAlt = "logo-alt";
export const kLogoHref = "logo-href";

export const kSidebarMenus = "sidebar-menus";

export interface Navbar {
  title?: string | false;
  logo?: string;
  [kLogoAlt]?: string;
  [kLogoHref]?: string;
  background:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  search?: boolean | string;
  left?: NavItem[];
  right?: NavItem[];
  collapse?: boolean;
  tools?: SidebarTool[];
  pinned?: boolean;
  [kCollapseBelow]?: LayoutBreak;
  [kSidebarMenus]?: boolean;
  darkToggle?: boolean;
  readerToggle?: boolean;
}

/* export interface NavItem {
  // href + more readable/understndable aliases
  icon?: string;
  href?: string;
  file?: string;
  text?: string;
  url?: string;
  [kAriaLabel]?: string;

  // core identification
  id?: string;

  // more
  menu?: NavItem[];
}
 */

export interface Sidebar {
  id?: string;
  title?: string;
  subtitle?: string;
  logo?: string;
  aligment?: "left" | "right" | "center";
  background?:
    | "none"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "white";
  search?: boolean | string;
  [kCollapseLevel]?: number;
  contents: SidebarItem[];
  tools: SidebarTool[];
  style: "docked" | "floating";
  pinned?: boolean;
  header?: Array<string> | string;
  footer?: Array<string> | string;
}

export type SidebarItem = NavigationItemObject & {
  // core structure/contents
  section?: string;
  sectionId?: string;
  contents?: SidebarItem[];

  // more
  expanded?: boolean;
  active?: boolean;

  // transient properties used for expanding 'auto'
  auto?: boolean | string | string[];
};

/*export interface SidebarTool {
  // label/contents
  icon?: string;
  text?: string;
  menu?: NavItem[];

  // href + more readable/understndable aliases
  href?: string;
  file?: string;
  url?: string;
}*/
