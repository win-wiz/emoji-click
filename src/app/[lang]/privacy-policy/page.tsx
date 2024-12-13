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

// 提取个人数据列表组件
const PersonalDataList = memo(({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-2 text-zinc-600 ml-4">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
));

PersonalDataList.displayName = 'PersonalDataList';

// 主组件
function PrivacyPolicy() {
  // i18n对象保持不变
  const _i18n = {
    "title": t`Ai Emoji 隐私政策`,
    "effective_date": t`生效日期：2024-12-12`,
    "overview": t`概述`,
    "overview_description": t`Subrise 运营网站 https://subrise.co/ 并致力于保护您的隐私。本隐私政策概述了我们收集的信息类型、我们如何使用这些信息，以及我们采取哪些步骤确保您的个人信息被适当处理。`,
    "information_collection": t`信息收集`,
    "personal_data": t`个人数据`,
    "personal_data_description": t`我们收集您自愿提供给我们的个人数据，包括但不限于：`,
    "personal_data_description_1": t`姓名`,
    "personal_data_description_2": t`电子邮件地址`,
    "personal_data_description_3": t`支付信息`,
    "personal_data_description_4": t`这些信息是为了在我们的 Subrise 导航站上处理订单而收集的。`,
    "non_personal_data": t`非个人数据`,
    "non_personal_data_description": t`我们还通过网络cookie收集非个人数据，其中包括您的IP地址、浏览器类型以及您在我们网站上访问的页面等使用详情。这些数据用于增强您在我们网站上的体验。`,
    "data_collection_purpose": t`数据收集目的`,
    "data_collection_purpose_description": t`收集您的数据的主要目的是处理您的订单并改善我们网站的功能和服务。`,
    "data_sharing": t`数据共享`,
    "data_sharing_description": t`Subrise 尊重您的隐私。我们不会与任何第三方分享您的个人数据，除非为了处理您的订单或遵守法律要求。`,
    "children_privacy": t`儿童隐私`,
    "children_privacy_description": t`我们的服务不适用于18岁以下的儿童。我们不会有意收集儿童的个人信息。`,
    "privacy_policy_update": t`本隐私政策的更新`,
    "privacy_policy_update_description": t`我们可能会不时更新我们的隐私政策。我们将通过在本页面上发布新的隐私政策并更新页面顶部的“生效日期”来通知您任何变更。我们还会通过电子邮件通知您重大变更。`,
    "contact_us": t`联系我们`,
    "contact_us_description": t`如果您对本隐私政策有任何疑问或担忧，请通过 support@subrise.co 与我们联系。`
  }

  // 个人数据项列表
  const personalDataItems = [
    _i18n['personal_data_description_1'],
    _i18n['personal_data_description_2'],
    _i18n['personal_data_description_3']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle 
          title={_i18n['title']} 
          effectiveDate={_i18n['effective_date']} 
        />

        <div className="space-y-8 bg-white/50 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Overview Section */}
          <ContentSection 
            title={_i18n['overview']} 
            content={_i18n['overview_description']} 
          />

          {/* Information Collection Section */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">
              {_i18n['information_collection']}
            </h2>
            
            <div className="space-y-6">
              {/* Personal Data */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-zinc-800 mb-3">
                  {_i18n['personal_data']}
                </h3>
                <p className="text-zinc-600 mb-4">
                  {_i18n['personal_data_description']}
                </p>
                <PersonalDataList items={personalDataItems} />
                <p className="mt-4 text-zinc-600">
                  {_i18n['personal_data_description_4']}
                </p>
              </div>

              {/* Non-Personal Data */}
              <ContentSection 
                title={_i18n['non_personal_data']} 
                content={_i18n['non_personal_data_description']} 
              />
            </div>
          </section>

          {/* Other Sections */}
          <section className="space-y-6">
            <ContentSection 
              title={_i18n['data_collection_purpose']} 
              content={_i18n['data_collection_purpose_description']} 
            />
            <ContentSection 
              title={_i18n['data_sharing']} 
              content={_i18n['data_sharing_description']} 
            />
            <ContentSection 
              title={_i18n['children_privacy']} 
              content={_i18n['children_privacy_description']} 
            />
            <ContentSection 
              title={_i18n['privacy_policy_update']} 
              content={_i18n['privacy_policy_update_description']} 
            />
          </section>

          {/* Contact Section */}
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

export default memo(PrivacyPolicy);
