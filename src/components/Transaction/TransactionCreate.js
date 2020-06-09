import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { APIURL } from '../../config';
import TransactionForm from './TransactionForm';

const NewTransaction = (props) => {
	// const initialTransactionState = {
	// 	transactionFields: {},
	// };
	const [transaction, setTransaction] = useState({});
	const [transactionTypes, setTransactionTypes] = useState({});
	const [createdId, setCreatedId] = useState(null);
	const [transactionInputs, setTransactionInputs] = useState([]);

	useEffect(() => {
		const url = `${APIURL}/api/transaction/types`;
		fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${props.userToken}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setTransactionTypes(data);
			})
			.catch(() => {
				console.error();
			});
		// eslint-disable-next-line
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		const url = `${APIURL}/api/transaction/new`;
		console.log('event:', event.target);
		// fetch(url, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${props.userToken}`,
		// 	},
		// 	body: JSON.stringify(transaction),
		// })
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		setCreatedId(data.id);
		// 	})
		// 	.catch((error) => console.error);
	};

	const handleChange = (event) => {
		event.persist();
		let transactionFieldValues = JSON.parse(JSON.stringify(transaction))
		transactionFieldValues[event.target.name] = event.target.value;
		console.log(transactionFieldValues);
		// Object.assign(transactionFieldValues);
		setTransaction(transactionFieldValues);
		// setTransaction({
		// 	...transaction,
		// 	[event.target.name]: event.target.value,
		// });
	};

	// convert snake_case data to Title Case for form
	function toTitleCase(str) {
		return str
			.replace(/([a-z])([A-Z])/g, function (
				allMatches,
				firstMatch,
				secondMatch
			) {
				return firstMatch + ' ' + secondMatch;
			})
			.toLowerCase()
			.replace(/([ -_]|^)(.)/g, function (allMatches, firstMatch, secondMatch) {
				return (firstMatch ? ' ' : '') + secondMatch.toUpperCase();
			});
	}
	const transactionTypesOptions = Object.keys(transactionTypes).map((item) => {
		return <option value={item}>{toTitleCase(item)}</option>;
	});

	const handleDropdownSelect = (event) => {
		setTransactionInputs([]);
		let inputs = Object.entries(transactionTypes[event.target.value]).map(
			([key, value]) => {
				return (
					<>
						<label id='user-form-label' htmlFor={key}>
							{toTitleCase(key)}
						</label>
						<input
							required
							key={key + event.target.value}
							type={value}
							name={key}
							onChange={(e) => handleChange(e)}
						/>
					</>
				);
			}
		);
		setTransactionInputs(inputs);
		const newTransaction = {};
		newTransaction[event.target.value] = {};
		setTransaction(newTransaction);
	};

	if (createdId) {
		return <Redirect to={'/user/all-transactions'} />;
	}

	return (
		<>
			<TransactionForm
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				transactionTypes={transactionTypesOptions}
				handleDropdownSelect={handleDropdownSelect}
				transactionInputs={transactionInputs}
			/>
		</>
	);
};

export default NewTransaction;
