'use client'

import { t } from '@lingui/macro';
import { memo } from 'react';

export const runtime = 'edge';

// 提取标题组件
const PageTitle = memo(({ title, effectiveDate }: { title: string; effectiveDate: string }) => (
  <div className="text-center mb-12">
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-800 to-violet-500 bg-clip-text text-transparent">
      {title}
    </h1>
    <div className="mt-2 w-20 h-1 bg-violet-200 mx-auto rounded-full"></div>
    <p className="mt-4 text-zinc-500">{effectiveDate}</p>
  </div>
));

PageTitle.displayName = 'PageTitle';

// 提取内容区块组件
const ContentSection = memo(({ title, content, className = '' }: { 
  title: string; 
  content: string;
  className?: string;
}) => (
  <div className={`bg-white rounded-xl p-6 ${className}`}>
    <h2 className="text-2xl font-bold text-zinc-800 mb-4">{title}</h2>
    <p className="text-zinc-600">{content}</p>
  </div>
));

ContentSection.displayName = 'ContentSection';

// 提取限制列表组件
const RestrictionsList = memo(({ items }: { items: string[] }) => (
  <div className="ml-4 space-y-2">
    {/* <p className="text-zinc-600">您不得：</p> */}
    <ul className="list-disc list-inside space-y-2 text-zinc-600 ml-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
));

RestrictionsList.displayName = 'RestrictionsList';

// 提取条款接受部分组件
const AcceptanceSection = memo(({ 
  title, 
  description, 
  restrictions, 
  conclusion 
}: { 
  title: string;
  description: string;
  restrictions: string[];
  conclusion: string;
}) => (
  <section className="bg-white rounded-xl p-6">
    <h2 className="text-2xl font-bold text-zinc-800 mb-4">{title}</h2>
    <div className="space-y-4">
      <p className="text-zinc-600">{description}</p>
      <RestrictionsList items={restrictions} />
      <p className="text-zinc-600">{conclusion}</p>
    </div>
  </section>
));

AcceptanceSection.displayName = 'AcceptanceSection';

function TermsOfService() {
  const _i18n = {
    "title": t`EmojiClick 服务条款`,
    "effective_date": t`生效日期：2024-12-12`,
    "overview": t`引言`,
    "overview_description": t`欢迎访问 EmojiClick。通过访问我们的网站 (https://emojis.click/)，您同意受这些服务条款、所有适用的法律和规定的约束，并同意您有责任遵守任何适用的当地法律。如果您不同意这些条款中的任何一条，您被禁止使用或访问本网站。`,
    "acceptance_of_terms": t`使用许可`,
    "acceptance_of_terms_description": t`允许暂时下载 EmojiClick 网站上的材料（信息或软件）一份，仅供个人、非商业的临时观看。这是授予许可，而不是转让所有权，并且在此许可下，您不得：`,
    "acceptance_of_terms_description_1": t`修改或复制材料；`,
    "acceptance_of_terms_description_2": t`将材料用于任何商业目的，或用于任何公共展示（商业或非商业）；`,
    "acceptance_of_terms_description_3": t`尝试对 EmojiClick 网站上的任何软件进行反编译或逆向工程；`,
    "acceptance_of_terms_description_4": t`从材料中移除任何版权或其他专有注释；`,
    "acceptance_of_terms_description_5": t`或将材料转移给另一个人或在任何其他服务器上“镜像”材料。`,
    "acceptance_of_terms_description_6": t`如果您违反这些限制中的任何一项，此许可将自动终止，并且 EmojiClick 可随时终止此许可。在终止您查看这些材料或此许可终止时，您必须销毁您是否以电子格式或印刷格式拥有的任何下载的材料。`,
    "disclaimer": t`免责声明`,
    "disclaimer_description": t`EmojiClick 网站上的材料按“原样”提供。EmojiClick 不作任何明示或暗示的保证，并在此放弃和否定所有其他保证，包括但不限于对适销性、特定用途的适用性或不侵犯知识产权或其他权利的暗示保证。`,
    "limitations": t`责任限制`,
    "limitations_description": t`在任何情况下，EmojiClick 或其供应商均不对任何损害（包括但不限于数据或利润损失或因业务中断造成的损害）承担责任，这些损害是由于使用或无法使用 EmojiClick 网站上的材料而引起的，即使 EmojiClick 或 EmojiClick 授权代表已被口头或书面通知可能会造成此类损害的可能性。`,
    "material_accuracy": t`材料准确性`,
    "material_accuracy_description": t`在 EmojiClick 网站上出现的材料可能包含技术、排印或摄影错误。EmojiClick 不保证其网站上的任何材料准确、完整或最新。EmojiClick 可以随时更改其网站上包含的材料而不作通知。但是，EmojiClick 不承诺更新材料。`,
    "links": t`链接`,
    "links_description": t`EmojiClick 未审查与其网站链接的所有站点，并且不对任何此类链接站点的内容负责。包含任何链接并不意味着 EmojiClick 对该站点的认可。使用任何此类链接网站由用户自行承担风险。`,
    "modifications": t`修改`,
    "modifications_description": t`EmojiClick 可以随时修改其网站的这些服务条款而不作通知。通过使用本网站，您同意受当时这些服务条款的约束。`,
    "governing_law": t`管辖法律`,
    "governing_law_description": t`这些条款和条件受美国法律的管辖并根据其解释，您不可撤销地服从该州或地点法院的专属管辖权。`,
    "contact_us": t`联系我们`,
    "contact_us_description": t`如果您对这些条款有任何疑问，请通过 support@emojis.click 与我们联系。`
  }

  // 限制条款列表
  const restrictionItems = [
    _i18n['acceptance_of_terms_description_1'],
    _i18n['acceptance_of_terms_description_2'],
    _i18n['acceptance_of_terms_description_3'],
    _i18n['acceptance_of_terms_description_4'],
    _i18n['acceptance_of_terms_description_5']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle 
          title={_i18n['title']} 
          effectiveDate={_i18n['effective_date']} 
        />

        <div className="space-y-8 bg-white/50 rounded-2xl p-6 md:p-8 shadow-sm">
          <ContentSection 
            title={_i18n['overview']} 
            content={_i18n['overview_description']} 
          />

          <AcceptanceSection 
            title={_i18n['acceptance_of_terms']}
            description={_i18n['acceptance_of_terms_description']}
            restrictions={restrictionItems}
            conclusion={_i18n['acceptance_of_terms_description_6']}
          />

          <section className="space-y-6">
            <ContentSection 
              title={_i18n['disclaimer']} 
              content={_i18n['disclaimer_description']} 
            />
            <ContentSection 
              title={_i18n['limitations']} 
              content={_i18n['limitations_description']} 
            />
            <ContentSection 
              title={_i18n['material_accuracy']} 
              content={_i18n['material_accuracy_description']} 
            />
            <ContentSection 
              title={_i18n['links']} 
              content={_i18n['links_description']} 
            />
            <ContentSection 
              title={_i18n['modifications']} 
              content={_i18n['modifications_description']} 
            />
            <ContentSection 
              title={_i18n['governing_law']} 
              content={_i18n['governing_law_description']} 
            />
          </section>

          <ContentSection 
            title={_i18n['contact_us']} 
            content={_i18n['contact_us_description']} 
            className="bg-violet-50"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(TermsOfService);
