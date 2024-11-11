import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Components} from "react-markdown";
import MallMap from "../MallMap/MallMap";
import SpecializedMenu from "../FoodPlanner/components/SpecializedMenu";
import {mockFoods} from "../FoodPlanner/mockData";

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
				<div
					style={{
						padding: "16px",
						border: "1px solid #ffd7d7",
						borderRadius: "8px",
						backgroundColor: "#fff5f5",
					}}
				>
					<p style={{color: "#e53e3e", margin: 0}}>
						MallMap requires both start and end parameters
					</p>
				</div>
			);
		}

		return (
			<div style={{margin: "24px 0"}}>
				<MallMap startLocation={paramsObj.start} endLocation={paramsObj.end} />
			</div>
		);
	};

	const renderMealPlanSelector = (componentData: string) => {
		console.log("=== PARSING MEAL PLAN SELECTOR PARAMETERS ===");
		console.log("Input string:", componentData);

		if (!mockFoods || mockFoods.length === 0) {
			return (
				<div
					style={{
						padding: "16px",
						border: "1px solid #ffd7d7",
						borderRadius: "8px",
						backgroundColor: "#fff5f5",
					}}
				>
					<p style={{color: "#e53e3e", margin: 0}}>No foods data available</p>
				</div>
			);
		}

		const parts = componentData.split("|");
		const restaurant = parts[0];
		const selections = parts.slice(1);

		console.log("Restaurant:", restaurant);
		console.log("Selections:", selections);

		// Filter foods by restaurant
		const restaurantFoods = mockFoods.filter(
			(food) => food.restaurant === restaurant
		);

		// Update quantities based on selections
		const updatedFoods = restaurantFoods.map((food) => {
			const selection = selections.find((sel) => {
				const [id] = sel.split(":");
				return id === food.id;
			});

			if (selection) {
				const [, count] = selection.split(":");
				return {
					...food,
					quantity: parseInt(count, 10),
				};
			}
			return {
				...food,
				quantity: 0,
			};
		});

		console.log("\nFiltered and updated foods for restaurant:", restaurant);
		console.log(
			updatedFoods.map((food) => ({
				id: food.id,
				name: food.name,
				quantity: food.quantity,
			}))
		);

		if (restaurantFoods.length === 0) {
			return (
				<div
					style={{
						padding: "16px",
						border: "1px solid #ffd7d7",
						borderRadius: "8px",
						backgroundColor: "#fff5f5",
					}}
				>
					<p style={{color: "#e53e3e", margin: 0}}>
						No matching foods found for the selected restaurant
					</p>
				</div>
			);
		}

		return <SpecializedMenu restaurantName={restaurant} foods={updatedFoods} />;
	};

	const components: Components = {
		p: ({children}) => {
			const text = String(children);
			const mallMapMatch = text.match(/^::tool\{MallMap\|(.+?)\}/);
			const mealPlanMatch = text.match(/^::tool\{MealPlanSelector\|(.+?)\}/);

			if (mallMapMatch) {
				return renderMallMap(mallMapMatch[1]);
			}

			if (mealPlanMatch) {
				console.log("TOOL PARAMETERS STRING:", mealPlanMatch[1]);
				return renderMealPlanSelector(mealPlanMatch[1]);
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
