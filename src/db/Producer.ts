
export class Producer {
    public id: number;
    public user_id: number;
    public name: string;
    public region_id: number;
    public date_creation: string;
    public description: string;
    public image_link: string;

    constructor(id: number, user_id: number, name: string, region_id: number, date_creation: string, description: string, image_link: string) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.region_id =  region_id;
        this.date_creation = date_creation;
        this.description = description;
        this.image_link = image_link;
    }

}
