import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Components} from "react-markdown";
import MallMap from "../MallMap/MallMap";

interface MarkdownRendererProps {
	content: string;
}

interface ParsedParams {
	start?: string;
	end?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({content}) => {
	const renderMallMap = (componentData: string) => {
		const params = componentData.split("|");
		const paramsObj: ParsedParams = params.reduce((acc, param) => {
			const [key, value] = param.split("=");
			return {...acc, [key]: value};
		}, {});

		if (!paramsObj.start || !paramsObj.end) {
			return (
				<div className="p-4 border border-red-200 rounded-lg bg-red-50">
					<p className="text-red-500">
						MallMap requires both start and end parameters
					</p>
				</div>
			);
		}

		return (
			<div className="my-6">
				<MallMap startLocation={paramsObj.start} endLocation={paramsObj.end} />
			</div>
		);
	};

	const components: Components = {
		p: ({children}) => {
			const text = String(children);
			const toolMatch = text.match(/^::tool\{MallMap\|(.+?)\}/);

			if (toolMatch) {
				return renderMallMap(toolMatch[1]);
			}

			return <p>{children}</p>;
		},
	};

	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
			{content}
		</ReactMarkdown>
	);
};

export default MarkdownRenderer;
