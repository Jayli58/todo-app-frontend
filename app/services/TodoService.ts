const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchTodos(idToken: string) {
    const response = await fetch(`${BASE_URL}/todo`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Fetch failed: ${response.status} ${text}`);
    }

    return response.json();
}
