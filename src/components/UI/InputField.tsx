import React, {useRef, useCallback, useState} from "react";
import styles from "@/components/UI/InputField.module.css";

interface InputFieldProps {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	disabled: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
	value: propValue,
	onChange,
	onSend,
	disabled,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [localValue, setLocalValue] = useState(propValue);
	const updateTimeoutRef = useRef<NodeJS.Timeout>();

	// Handle local state updates immediately for responsive typing
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;
		setLocalValue(newValue); // Update local state immediately

		// Throttle the parent state update
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}

		updateTimeoutRef.current = setTimeout(() => {
			onChange(newValue); // Update parent state after delay

			// Adjust height after state update
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
				textareaRef.current.style.height = `${Math.min(
					textareaRef.current.scrollHeight,
					200
				)}px`;
			}
		}, 300); // Approximately 1 frame at 60fps
	};

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				localValue.trim() !== ""
			) {
				event.preventDefault();
				onSend();
				if (textareaRef.current) {
					textareaRef.current.focus();
				}
			}
		},
		[localValue, onSend]
	);

	// Sync local state with prop value when it changes externally
	React.useEffect(() => {
		setLocalValue(propValue);
	}, [propValue]);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	return (
		<textarea
			ref={textareaRef}
			className={styles.messageInput}
			value={localValue} // Use local state for immediate updates
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			placeholder="Type a message..."
			disabled={disabled}
			rows={1}
			style={{
				overflowY: "hidden",
				minHeight: "24px",
				maxHeight: "200px",
			}}
		/>
	);
};

export default React.memo(InputField);
