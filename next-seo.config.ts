const title = 'Bubble'
const description = 'Bubble is a live chat, powered by Twilio.'
const url = 'https://bubble-peach.vercel.app'

const imageUrl = `https://og-image.vercel.app/${encodeURI(
	title
)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`

const keywords = 'bubble, bubble chat, twilio, chat, live chat, whatsapp'

const seo = {
	titleTemplate: `%s | ${title}`,
	defaultTitle: title,
	description,
	openGraph: {
		description,
		title,
		locale: 'en_US',
		type: 'website',
		url,
		canonical: url,
		images: [
			{
				url: imageUrl,
				width: 800,
				height: 600,
				alt: title
			}
		]
	},
	twitter: {
		handle: '@marsidev',
		site: '@marsidev',
		cardType: 'summary_large_image'
	},
	additionalMetaTags: [
		{
			name: 'keywords',
			content: keywords
		}
	],
	additionalLinkTags: [
		{
			rel: 'icon',
			href: '/favicon.ico'
		}
	]
}

export { seo as defaultSeo, url as defaultUrl }
