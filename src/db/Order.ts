export class Order {
    public id: number;
    public user_id: number;
    public name: string;
    public region_id: number;
    public small_description: string;
    public description: string;
    public random_key: string;
    public image_link: string;
    public date_creation: string

    constructor(id: number, user_id: number, name: string, region_id: number, small_description: string,  description: string, random_key: string, image_link: string, date_creation: string) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.region_id = region_id;
        this.small_description = small_description;
        this.description = description;
        this.random_key = random_key;
        this.image_link = image_link;
        this.date_creation = date_creation;
    }

}
