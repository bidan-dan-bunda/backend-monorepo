/* describe('should be able to do anything (all CRUD operations)', () => {
      test('should be able to create data', async () => {
        for (const resource of allMethodsResources) {
          const schema = getSchemaForGenerator(resource);
          if (schema) {
            const data = generateData(schema);
            const res = await reqToResourceUrl({ resource, body: data });
            expect(res.status).toBe(201);
          }
        }
      });

      test('should be able to edit data', async () => {
        for (const resource of allMethodsResources) {
          const schema = getSchemaForGenerator(resource);
          if (schema) {
            const data = generateData(schema);
            const postRes = await reqToResourceUrl({ resource, body: data });
            const resourceId = postRes.data.data.id;
            const putRes = await reqToResourceUrl({
              resource,
              urlPostfix: resourceId,
              method: 'put',
              body: data,
            });
            expect(putRes.status).toBe(200);
          }
        }
      });

      test('should be able to destroy data', async () => {
        for (const resource of allMethodsResources) {
          const schema = getSchemaForGenerator(resource);
          if (schema) {
            const data = generateData(schema);
            const postRes = await reqToResourceUrl({ resource, body: data });
            const resourceId = postRes.data.data.id;
            const deleteRes = await reqToResourceUrl({
              resource,
              urlPostfix: resourceId,
              method: 'delete',
              body: data,
            });
            expect(deleteRes.status).toBe(200);
          }
        }
      });
    }); */
