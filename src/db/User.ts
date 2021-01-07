export class User {
    public id: number;
    public email: string;
    public password: string;
    public name: string;
    public phone: string;

    constructor(id: number, email: string, password: string, name: string, phone: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

}
