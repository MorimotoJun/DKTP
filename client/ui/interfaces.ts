export interface Tab {
    title: string;
    contents: Content[];
}

export interface Content {
    id:number;
    token_id?:number;
    user_address:string;
    title:string;
    content:string;
    deleted:number;
    listed:number;
    price:number;
    purchase_method:null;
    thumbnail:string;
    ipfs_hash:string | null;
    created_at:string;
    updated_at:string;

}