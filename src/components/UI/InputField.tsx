import React, {useRef, useCallback, useState, useEffect} from "react";
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
	const pendingUpdateRef = useRef<string | null>(null);
	const updateTimeoutRef = useRef<NodeJS.Timeout>();

	// Synchronize local state with prop value
	useEffect(() => {
		if (propValue !== localValue && pendingUpdateRef.current !== localValue) {
			setLocalValue(propValue);
		}
	}, [propValue, localValue]);

	const flushPendingUpdate = useCallback(() => {
		if (pendingUpdateRef.current !== null) {
			onChange(pendingUpdateRef.current);
			pendingUpdateRef.current = null;
		}
	}, [onChange]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = event.target.value;
			setLocalValue(newValue);
			pendingUpdateRef.current = newValue;

			// Clear existing timeout
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}

			// Set new timeout for parent state update
			updateTimeoutRef.current = setTimeout(() => {
				flushPendingUpdate();

				// Adjust height after state update
				if (textareaRef.current) {
					textareaRef.current.style.height = "auto";
					textareaRef.current.style.height = `${Math.min(
						textareaRef.current.scrollHeight,
						200
					)}px`;
				}
			}, 100);
		},
		[flushPendingUpdate]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				localValue.trim() !== ""
			) {
				event.preventDefault();

				// Flush any pending updates before sending
				flushPendingUpdate();

				// Small delay to ensure state is updated
				setTimeout(() => {
					onSend();
				}, 0);

				if (textareaRef.current) {
					textareaRef.current.focus();
				}
			}
		},
		[localValue, onSend, flushPendingUpdate]
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
			// Flush any pending updates
			flushPendingUpdate();
		};
	}, [flushPendingUpdate]);

	return (
		<textarea
			ref={textareaRef}
			className={styles.messageInput}
			value={localValue}
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
