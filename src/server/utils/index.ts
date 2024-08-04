export function getData(url: string) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then((data: unknown) => resolve(data))
            .catch(reject)
    })
}
