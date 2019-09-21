const deliveryChangeStatus = async function (login, pass, server) {
    const serverUrl = server || process.env.FISCAL_DEFAULT_SERVER
    let axConf = {
        method: "get",
        baseURL: `https://${serverUrl}/kkm-trade/atolpossystem/v4/getToken`,
        params: {
            "login": login,
            "pass": pass
        }

    }
    return await axios(axConf)
        .then((response) => {
            return response.data.token
        })

}