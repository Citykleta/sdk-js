var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["GET"] = "GET";
    HTTPMethod["DELETE"] = "DELETE";
})(HTTPMethod || (HTTPMethod = {}));
const parseResponse = async (response) => {
    if (response.ok === false) {
        throw {
            status: response.status,
            message: await response.json()
        };
    }
    return response.json();
};
const defaultUrl = 'https://api.citykleta.com';
const sdk = (fetch, URL, btoa) => ({ url = defaultUrl } = { url: 'https://api.citykleta.com' }) => {
    const baseUrl = () => new URL(url);
    const withUrl = (mixin) => Object.defineProperties(mixin, {
        url: {
            get() {
                return baseUrl().href;
            }
        }
    });
    const defaultHeaders = opts => {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (opts.token) {
            headers.Authorization = `Bearer ${opts.token}`;
        }
        else if (opts.secret && opts.clientId) {
            headers.Authorization = `Basic ` + btoa(`${opts.clientId}:${opts.secret}`);
        }
        return headers;
    };
    const listable = (path) => (opts = {}) => {
        const headers = defaultHeaders(opts);
        const baseUrl = new URL(url);
        return withUrl({
            async list({ page = 1, size = 15 } = { page: 1, size: 15 }) {
                const url = new URL(path, baseUrl);
                url.searchParams.append('page', page);
                url.searchParams.append('size', size);
                const response = await fetch(url.href, {
                    headers
                });
                return parseResponse(response);
            },
            async one(id) {
                const url = new URL(`${path}/${id}`, baseUrl);
                const response = await fetch(url.href, {
                    headers
                });
                return parseResponse(response);
            }
        });
    };
    return {
        Users: listable('/users'),
        Bikes: listable('/bikes'),
        Businesses: listable('/businesses'),
        Tokens(opts = {}) {
            const headers = defaultHeaders(opts);
            return withUrl({
                async create({ username, password }) {
                    const url = baseUrl();
                    url.pathname = `/tokens`;
                    const response = await fetch(url.href, {
                        method: "POST" /* POST */,
                        headers,
                        body: JSON.stringify({
                            grant_type: 'password',
                            username,
                            password
                        })
                    });
                    return parseResponse(response);
                }
            });
        }
    };
};

export { HTTPMethod, sdk };
