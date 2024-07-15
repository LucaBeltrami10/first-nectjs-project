import { rm } from "fs/promises";
import { join } from "path";
import { catchError } from "rxjs";

// rimuove il file test.sqlite (db utilizzato solo per i test) prima di ogni test (in beforeEach)
global.beforeEach(async () => {
    try{
        await rm(join(__dirname, '..', 'test.sqlite'))
    }catch(err) {}
});