import { IProduct, IProductsFile } from "@/app/products/interfaces";

export function reorderProducts(data: IProductsFile): IProduct[] {
    const { orderBy, products } = data;
    const existingIds = new Set(products.map(p => p.id));
    const validOrderIds = orderBy.filter(id => existingIds.has(id));
    const orderedItems = validOrderIds
        .map(id => products.find(product => product.id === id))
        .filter((product): product is IProduct => product !== undefined);

    const remainingItems = products.filter(product =>
        !validOrderIds.includes(product.id)
    );

    return [...orderedItems, ...remainingItems];
}