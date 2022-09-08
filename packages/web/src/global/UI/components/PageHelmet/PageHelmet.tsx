import React from "react";
import { Helmet } from "react-helmet-async";

export type PageHelmetProps = {
	title?: string;
	image?: string;
	description?: string;
	keywords?: string;
}

// TODO: update default values
const defaultValues: PageHelmetProps = {
	title: undefined,
	description: undefined,
	keywords: undefined,
	image: undefined,
}

/* Returns array of keywords as a comma separated string */
export const joinKeywordsArray = (keywords: (string | undefined)[]) => {
	return keywords?.filter(kw => !!kw)?.join(", ") ?? "";
}

export type PageHelmetPropsWithoutDefaults = Omit<PageHelmetProps, "defaultValues">;

/**
 * Page helmet for setting data that exists in the document's <head>
 */
export const PageHelmet = React.memo(function PageHelmet(props: PageHelmetProps) {
	const {
		title, image, description, keywords
	} = props;

	// override any default values provided through props
	const currentValues: PageHelmetPropsWithoutDefaults = {
		title: title ?? defaultValues?.title,
		description: description ?? defaultValues?.description,
		image: image ?? defaultValues?.image,
		keywords: joinKeywordsArray([defaultValues?.keywords, keywords]),
	}

	return (
		<Helmet>
			{/* SEO */}
			<title>{currentValues.title}</title>
            <meta name={"description"} content={currentValues.description}/>
			<meta name={"keywords"} content={currentValues.keywords}/>

			{/* SOCIAL MEDIA */}
			<meta property={"og:title"} content={currentValues.title}/>
            <meta property={"og:description"} content={currentValues.image}/>
            <meta property={"og:image"} content={currentValues.description}/>
			{/* <meta property={"og:site_name"} content={}/> */}
            {/* <meta property={"twitter:image:alt"} content={imageAlt || defaultMeta.imageAlt}/> */}
            {/* <meta property={"fb:app_id"} content={}/> */}
            {/* <meta property={"twitter:site"} content={}/> */}
		</Helmet>
	)
})