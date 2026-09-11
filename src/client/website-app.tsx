import type { WorkbenchAppDefinition, WorkbenchIconProps, WorkbenchTemplateDefinition } from './types.ts'
import { WebsiteCreate } from './WebsiteCreate.tsx'
import { WebsiteIcon } from './WebsiteIcon.tsx'
import { WebsiteView } from './WebsiteView.tsx'
import { WEBSITE_APP_ID, WEBSITE_TEMPLATE_ID, validateWebsiteConfig, validateWebsiteCreation } from './website.ts'

function InstanceIcon({ instance, ...props }: WorkbenchIconProps): JSX.Element {
  return <WebsiteIcon {...props} url={typeof instance?.config.url === 'string' ? instance.config.url : undefined} faviconUrl={typeof instance?.config.faviconUrl === 'string' ? instance.config.faviconUrl : undefined} />
}

export function websiteApp(): WorkbenchAppDefinition {
  return {
    protocolVersion: 1,
    appId: WEBSITE_APP_ID,
    title: '网页',
    allowMultiple: true,
    config: { version: 1, defaults: () => ({ url: '', openMode: 'embedded' }), validate: validateWebsiteConfig, validateCreation: validateWebsiteCreation },
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderIcon: InstanceIcon,
    renderCreate: WebsiteCreate,
    renderMain: WebsiteView,
  }
}

export function websiteTemplate(): WorkbenchTemplateDefinition {
  return { templateId: WEBSITE_TEMPLATE_ID, kind: 'instance', appId: WEBSITE_APP_ID, title: '从网页地址创建', defaultTitle: '', defaultConfig: { url: '', openMode: 'embedded' } }
}
