import { useState, useEffect } from "react";
import axios from "axios";

const Table = (props) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = (e) => {
		setDeleting(true)
		axios.post(`${props.baseUrl}/sublist/delete?id=${e.target.id}`, {},{
			headers: {
				Authorization: localStorage.getItem("token")
			}
		})
		.then((res) => {
			console.log(res)
			console.log("Entry deleted from database")
			setData(data.filter((row) => row.id !== parseInt(e.target.id)))
			setDeleting(false)
		})
		.catch((err) => {
			console.log(err)
			console.log("Delete operation failed")
			setDeleting(false)
		})

	}

	const fetchData = () => {
		console.log("fetching data");
		setLoading(true);
		axios
			.get(`${props.baseUrl}/sublist`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			})
			.then((res) => {
				console.log(res);
				setData(res.data.sublist);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err)
				if (err || err.response.status === 401) {
					setLoading(false);
				}
			});
	};

	useEffect(() => {
		fetchData();
	}, [data.length === 0]);

	return (
		<>
			{loading ? (
				<i className="fas fa-spin fa-spinner fa-2x"></i>
			) : data.length === 0 ? (
				<div
					className="bg-blue-100 rounded border border-blue-500 text-blue-700 px-4 py-3"
					role="alert"
				>
					<p className="font-bold">No data available</p>
					<p className="text-sm">
						Click the refresh button below to check for data.
					</p>
					<button
						onClick={fetchData}
						className=" mt-3 w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Refresh
					</button>
				</div>
			) : (
				<div className="max-w-400">
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Sl. No.
									</th>
									<th scope="col" className="px-6 py-3">
										Name
									</th>
									<th scope="col" className="px-6 py-3">
										Email ID
									</th>
									<th scope="col" className="px-6 py-3">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{data.map((s, i) => (
									<tr
										key={i}
										className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
									>
										<td
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{i+1}
										</td>
										<td className="px-6 py-4">{s.name}</td>
										<td className="px-6 py-4">{s.email}</td>
										<th className="px-6 py-4">
											{deleting?<i className="fas fa-spin fa-spinner h-fit"></i>:<button onClick={handleDelete} id={s.id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
												Delete
											</button>}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</>
	);
};

export default Table;
