import React from "react";
import { Helmet } from "react-helmet-async";

export type PageHelmetProps = {
	title?: string;
	image?: string;
	description?: string;
	keywords?: string;
}

const defaultValues: PageHelmetProps = {
	title: "Leaps 'n' Bounds",
	description: "Create & manage your goals for the day, week and month.",
	keywords: undefined,
	image: "/meta_img.png",
}

/* Returns array of keywords as a comma separated string */
export const joinKeywordsArray = (keywords: (string | undefined)[]) => {
	return keywords?.filter(kw => !!kw)?.join(", ") ?? "";
}

export type PageHelmetPropsWithoutDefaults = Omit<PageHelmetProps, "defaultValues">;

/**
 * Page helmet for setting page meta data
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
			<title>{(props.title ? `${props.title} | ` : "") + defaultValues.title}</title>
            <meta name={"description"} content={currentValues.description}/>
			<meta name={"keywords"} content={currentValues.keywords}/>

			{/* SOCIAL MEDIA */}
			<meta property={"og:title"} content={currentValues.title}/>
            <meta property={"og:description"} content={currentValues.image}/>
            <meta property={"og:image"} content={currentValues.description}/>
		</Helmet>
	)
})