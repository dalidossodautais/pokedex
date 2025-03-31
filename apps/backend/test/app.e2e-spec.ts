/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /pokemon/:id", () => {
    it("should return pokemon data when given a valid ID", () => {
      return request(app.getHttpServer())
        .get("/pokemon/25")
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("id", 25);
          expect(res.body).toHaveProperty("name", "Pikachu");

          expect(res.body).toHaveProperty("types");
          expect(res.body.types).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                code: "electric",
              }),
            ]),
          );

          expect(res.body).toHaveProperty("height");
          expect(res.body.height).toEqual(expect.any(Number));
          expect(res.body).toHaveProperty("weight");
          expect(res.body.weight).toEqual(expect.any(Number));

          expect(res.body).toHaveProperty("stats");
          expect(res.body.stats).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String) as unknown,
                value: expect.any(Number) as unknown,
              }),
            ]),
          );

          expect(res.body).toHaveProperty("sprites");
          expect(res.body.sprites).toHaveProperty("front_default");
          expect(res.body.sprites).toHaveProperty("back_default");
          expect(res.body.sprites.front_default).toEqual(expect.any(String));
          expect(res.body.sprites.front_default).toContain("https://");
        });
    });

    it("should return French pokemon data when lang parameter is fr", () => {
      return request(app.getHttpServer())
        .get("/pokemon/25?lang=fr")
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("id", 25);
          expect(res.body).toHaveProperty("name");
          expect(res.body.types).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: "Électrik",
                code: "electric",
              }),
            ]),
          );
          expect(res.body.stats).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: "PV",
                value: expect.any(Number) as unknown,
              }),
            ]),
          );
        });
    });

    it("should return detailed info for bulbasaur", () => {
      return request(app.getHttpServer())
        .get("/pokemon/1")
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("id", 1);
          expect(res.body).toHaveProperty("name", "Bulbasaur");
          expect(res.body.types).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: "grass" }),
              expect.objectContaining({ code: "poison" }),
            ]),
          );
        });
    });

    it("should return 400 when given an invalid ID", () => {
      return request(app.getHttpServer())
        .get("/pokemon/invalid")
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe("Invalid Pokemon ID");
        });
    });

    it("should return 404 when pokemon is not found", () => {
      return request(app.getHttpServer()).get("/pokemon/999999").expect(404);
    });
  });

  describe("Performance and limits", () => {
    it("should handle multiple requests in sequence", async () => {
      await request(app.getHttpServer()).get("/pokemon/1").expect(200);
      await request(app.getHttpServer()).get("/pokemon/4").expect(200);
      await request(app.getHttpServer()).get("/pokemon/7").expect(200);
    });

    it("should handle multiple languages in sequence", async () => {
      await request(app.getHttpServer()).get("/pokemon/1?lang=en").expect(200);
      await request(app.getHttpServer()).get("/pokemon/1?lang=fr").expect(200);
      await request(app.getHttpServer()).get("/pokemon/1?lang=es").expect(200);
    });

    it("should respect query param limits if implemented", async () => {
      const response = await request(app.getHttpServer()).get(
        "/pokemon?limit=3",
      );
      if (response.status === 200) {
        expect(response.body.length).toBeLessThanOrEqual(3);
      }
    });
  });
});
