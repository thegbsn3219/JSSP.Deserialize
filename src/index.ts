import "@k2oss/k2-broker-core";

metadata = {
  systemName: "com.k2.example",
  displayName: "Example Broker",
  description: "An example broker that accesses JSONPlaceholder.",
};

ondescribe = async function ({ configuration }): Promise<void> {
  postSchema({
    objects: {
      todo: {
        displayName: "DeserializeStrings",
        description: "Deserializes Serialized Objects",
        properties: {
          deserializedString: {
            displayName: "Deserialized String",
            type: "string",
          },
          GroupID: {
            displayName: "GroupID",
            type: "string",
          },
          ServiceDate: {
            displayName: "ServiceDate",
            type: "string",
          },
          DelinqDate: {
            displayName: "DelinqDate",
            type: "string",
          },
          RemovalReason: {
            displayName: "RemovalReason",
            type: "string",
          },
        },
        methods: {
          getParams: {
            displayName: "Deserialize",
            type: "read",
            parameters: {
              serializedString: {
                displayName: "Serialized String",
                description: "Serialized String",
                type: "string",
              },
            },
            requiredParameters: ["serializedString"],
            outputs: ["GroupID","ServiceDate","DelinqDate","RemovalReason"],
          },
        },
      },
    },
  });
};

onexecute = async function ({
  objectName,
  methodName,
  parameters,
  properties,
  configuration,
  schema,
}): Promise<void> {
  switch (objectName) {
    case "todo":
      await onexecuteTodo(methodName, properties, parameters);
      break;
    default:
      throw new Error("The object " + objectName + " is not supported.");
  }
};

async function onexecuteTodo(
  methodName: string,
  properties: SingleRecord,
  parameters: SingleRecord
): Promise<void> {
  switch (methodName) {
    case "getParams":
      await onexecuteTodoGetWithParams(parameters);
      break;
    default:
      throw new Error("The method " + methodName + " is not supported.");
  }
}

function onexecuteTodoGetWithParams(parameters: SingleRecord): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      interface theObject {
        GroupID: number;
        ServiceDate: Date;
        DelinqDate: Date;
        RemovalReason: string;
    }
    let parsedObj: theObject = JSON.parse(parameters["serializedString"].toString());
      postResult({
        GroupID: parsedObj.GroupID, ServiceDate: parsedObj.ServiceDate, DelinqDate: parsedObj.DelinqDate, RemovalReason: parsedObj.RemovalReason
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
