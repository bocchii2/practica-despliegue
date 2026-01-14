const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = require("../index");

describe("Test de la API", () => {

    const testUser = {
      id: 1,
      name: "Test User",
      email: "testuser@example.com",
    };


    afterAll(() =>{
      const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
      const filtered = users.filter(user => user.id !== testUser.id);
      fs.writeFileSync('./users.json', JSON.stringify(filtered, null, 2), 'utf-8');
    });

    it("Debe responder el enpoint raiz", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch("Servidor en ejecucion en el puerto 3000");
    });

    it("Debe crear un nuevo usuario", async () => {
      const res = await request(app).post("/users").send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toMatchObject(testUser);
    });

    it("Debe obtener todos los usuarios", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("Debe obtener un usuario por ID", async () => {
      const res = await request(app).get(`/users/${testUser.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toMatchObject(testUser);
    });



    it("Debe actualizar un usuario", async () => {
      const res = await request(app).put(`/users/${testUser.id}`).send(testUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toMatchObject(testUser);
    });

    it("Debe eliminar un usuario", async () => {
      const res = await request(app).delete(`/users/${testUser.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User deleted successfully');
    });
});
