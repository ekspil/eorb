const deliveryChangeStatus = async function (order_id, status) {
    //accepted, production, cooked, sent, done, canceled(отменен)
    let axConf = {
        method: "get",
        baseURL: `https://delivery.rb24.ru/common_api/set_order_status/${order_id}/${status}`,
        params: {
            "apikey": "ZmFkMTlhNzQyMGRhMGI4N2NlOTQwZTI0MmQ3OTk1MTU3NjIwMmRkMA"

        }

    }
    return await axios(axConf)
        .then((response) => {
            return response.data.success
        })

}