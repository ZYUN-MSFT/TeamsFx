import * as chai from "chai";
import * as sinon from "sinon";
import * as chaipromised from "chai-as-promised";
import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as handler from "../../src/officeChat/handlers";
import * as telemetry from "../../src/chat/telemetry";
import * as util from "../../src/chat/utils";
import * as localizeUtils from "../../src/utils/localizeUtils";
import * as officeCreateCommandHandler from "../../src/officeChat/commands/create/officeCreateCommandHandler";
import * as generatecodeCommandHandler from "../../src/officeChat/commands/generatecode/generatecodeCommandHandler";
import * as officeNextStepCommandHandler from "../../src/officeChat/commands/nextStep/officeNextstepCommandHandler";
import { URI } from "../mocks/vsc/uri";
import { OfficeChatCommand } from "../../src/officeChat/consts";
import { CancellationToken } from "../mocks/vsc";
import { ExtTelemetry } from "../../src/telemetry/extTelemetry";

chai.use(chaipromised);

describe("File: officeChat/handlers.ts", () => {
  const sandbox = sinon.createSandbox();

  describe("Method: officeChatRequestHandler", () => {
    const response = {
      markdown: sandbox.stub(),
      button: sandbox.stub(),
    };
    const token = new CancellationToken();
    afterEach(() => {
      sandbox.restore();
    });

    it("call officeCreateCommandHandler", async () => {
      const request: vscode.ChatRequest = {
        prompt: "test",
        command: OfficeChatCommand.Create,
        variables: [],
        location: vscode.ChatLocation.Panel,
      };
      const officeCreateCommandHandlerStub = sandbox.stub(officeCreateCommandHandler, "default");
      handler.officeChatRequestHandler(
        request,
        {} as unknown as vscode.ChatContext,
        response as unknown as vscode.ChatResponseStream,
        token
      );
      chai.expect(officeCreateCommandHandlerStub.calledOnce);
    });

    it("call generatecodeCommandHandler", async () => {
      const request: vscode.ChatRequest = {
        prompt: "test",
        command: OfficeChatCommand.GenerateCode,
        variables: [],
        location: vscode.ChatLocation.Panel,
      };
      const generatecodeCommandHandlerStub = sandbox.stub(generatecodeCommandHandler, "default");
      handler.officeChatRequestHandler(
        request,
        {} as unknown as vscode.ChatContext,
        response as unknown as vscode.ChatResponseStream,
        token
      );
      chai.expect(generatecodeCommandHandlerStub.calledOnce);
    });

    it("call officeNextStepCommandHandler", async () => {
      const request: vscode.ChatRequest = {
        prompt: "test",
        command: OfficeChatCommand.NextStep,
        variables: [],
        location: vscode.ChatLocation.Panel,
      };
      const officeNextStepCommandHandlerStub = sandbox.stub(
        officeNextStepCommandHandler,
        "default"
      );
      handler.officeChatRequestHandler(
        request,
        {} as unknown as vscode.ChatContext,
        response as unknown as vscode.ChatResponseStream,
        token
      );
      chai.expect(officeNextStepCommandHandlerStub.calledOnce);
    });

    it("call officeDefaultHandler", async () => {
      const request: vscode.ChatRequest = {
        prompt: "test",
        command: "",
        variables: [],
        location: vscode.ChatLocation.Panel,
      };
      const officeChatTelemetryDataMock = sandbox.createStubInstance(telemetry.ChatTelemetryData);
      sandbox.stub(officeChatTelemetryDataMock, "properties").get(function getterFn() {
        return undefined;
      });
      sandbox.stub(officeChatTelemetryDataMock, "measurements").get(function getterFn() {
        return undefined;
      });
      officeChatTelemetryDataMock.chatMessages = [];
      sandbox
        .stub(telemetry.ChatTelemetryData, "createByParticipant")
        .returns(officeChatTelemetryDataMock);
      sandbox.stub(ExtTelemetry, "sendTelemetryEvent");
      const verbatimCopilotInteractionStub = sandbox.stub(util, "verbatimCopilotInteraction");
      await handler.officeChatRequestHandler(
        request,
        {} as unknown as vscode.ChatContext,
        response as unknown as vscode.ChatResponseStream,
        token
      );
      chai.expect(verbatimCopilotInteractionStub.calledOnce);
    });
  });

  describe("method: chatCreateOfficeProjectCommandHandler", () => {
    afterEach(async () => {
      sandbox.restore();
    });

    it("undefined workspace folders", async () => {
      sandbox.stub(vscode.workspace, "workspaceFolders").value(undefined);
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve("Browse...") as unknown as Promise<vscode.QuickPickItem>);
      const fsCopyStub = sandbox.stub(fs, "copy");
      const customFolderPath = "customFolderPath";
      const customFolder: URI[] = [URI.file(customFolderPath)];
      const showOpenDialogStub = sandbox
        .stub(vscode.window, "showOpenDialog")
        .returns(Promise.resolve(customFolder));
      const showInformationMessageStub = sandbox.stub(vscode.window, "showInformationMessage");
      const executeCommandStub = sandbox.stub(vscode.commands, "executeCommand");
      sandbox.stub(localizeUtils, "localize").returns("Current Workspace");
      await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(showQuickPickStub.called).to.equal(false);
      chai.expect(showOpenDialogStub.calledOnce).to.equal(true);
      chai.expect(fsCopyStub.args[0][0]).to.equal("fakeFolder");
      chai.expect(path.basename(fsCopyStub.args[0][1])).to.equal(customFolderPath);
      chai.expect(fsCopyStub.calledOnce).to.equal(true);
      chai.expect(showInformationMessageStub.called).to.equal(false);
      chai
        .expect(executeCommandStub.calledOnceWith("vscode.openFolder", URI.file(customFolderPath)))
        .to.equal(true);
    });

    it("choose no folder", async () => {
      sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([{ uri: { fsPath: "workspacePath" } }]);
      const fsCopyStub = sandbox.stub(fs, "copy");
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve(undefined));
      const result = await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(result).to.equal(undefined);
      chai.expect(showQuickPickStub.calledOnce).to.equal(true);
      chai.expect(fsCopyStub.called).to.equal(false);
    });

    it("choose workspace folder", async () => {
      sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([{ uri: { fsPath: "workspacePath" } }]);
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve("Current Workspace") as unknown as Promise<vscode.QuickPickItem>);
      const fsCopyStub = sandbox.stub(fs, "copy");
      const showOpenDialogStub = sandbox.stub(vscode.window, "showOpenDialog");
      const showInformationMessageStub = sandbox.stub(vscode.window, "showInformationMessage");
      const executeCommandStub = sandbox.stub(vscode.commands, "executeCommand");
      sandbox.stub(localizeUtils, "localize").returns("Current Workspace");
      await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(showQuickPickStub.calledOnce).to.equal(true);
      chai.expect(showOpenDialogStub.called).to.equal(false);
      chai.expect(fsCopyStub.args[0]).to.deep.equal(["fakeFolder", "workspacePath"]);
      chai.expect(fsCopyStub.calledOnce).to.equal(true);
      chai.expect(showInformationMessageStub.calledOnce).to.equal(true);
      chai
        .expect(executeCommandStub.calledOnceWith("workbench.view.extension.teamsfx"))
        .to.equal(true);
    });

    it("choose to browse and select no folder", async () => {
      sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([{ uri: { fsPath: "workspacePath" } }]);
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve("Browse...") as unknown as Promise<vscode.QuickPickItem>);
      const fsCopyStub = sandbox.stub(fs, "copy");
      const showOpenDialogStub = sandbox
        .stub(vscode.window, "showOpenDialog")
        .returns(Promise.resolve(undefined));
      const showInformationMessageStub = sandbox.stub(vscode.window, "showInformationMessage");
      const executeCommandStub = sandbox.stub(vscode.commands, "executeCommand");
      sandbox.stub(localizeUtils, "localize").returns("Current Workspace");
      await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(showQuickPickStub.calledOnce).to.equal(true);
      chai.expect(showOpenDialogStub.calledOnce).to.equal(true);
      chai.expect(fsCopyStub.called).to.equal(false);
      chai.expect(showInformationMessageStub.called).to.equal(false);
      chai.expect(executeCommandStub.called).to.equal(false);
    });

    it("choose to browse and select custom folder", async () => {
      sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([{ uri: { fsPath: "workspacePath" } }]);
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve("Browse...") as unknown as Promise<vscode.QuickPickItem>);
      const fsCopyStub = sandbox.stub(fs, "copy");
      const customFolderPath = "customFolderPath";
      const customFolder: URI[] = [URI.file(customFolderPath)];
      const showOpenDialogStub = sandbox
        .stub(vscode.window, "showOpenDialog")
        .returns(Promise.resolve(customFolder));
      const showInformationMessageStub = sandbox.stub(vscode.window, "showInformationMessage");
      const executeCommandStub = sandbox.stub(vscode.commands, "executeCommand");
      sandbox.stub(localizeUtils, "localize").returns("Current Workspace");
      await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(showQuickPickStub.calledOnce).to.equal(true);
      chai.expect(showOpenDialogStub.calledOnce).to.equal(true);
      chai.expect(fsCopyStub.args[0][0]).to.equal("fakeFolder");
      chai.expect(path.basename(fsCopyStub.args[0][1])).to.equal(customFolderPath);
      chai.expect(fsCopyStub.calledOnce).to.equal(true);
      chai.expect(showInformationMessageStub.called).to.equal(false);
      chai
        .expect(executeCommandStub.calledOnceWith("vscode.openFolder", URI.file(customFolderPath)))
        .to.equal(true);
    });

    it("copy files error", async () => {
      const copyError = new Error("fakeError");
      sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([{ uri: { fsPath: "workspacePath" } }]);
      const showQuickPickStub = sandbox
        .stub(vscode.window, "showQuickPick")
        .returns(Promise.resolve("Current Workspace") as unknown as Promise<vscode.QuickPickItem>);
      const fsCopyStub = sandbox.stub(fs, "copy").throwsException(copyError);
      const showOpenDialogStub = sandbox.stub(vscode.window, "showOpenDialog");
      const showErrorMessageStub = sandbox.stub(vscode.window, "showErrorMessage");
      const consoleLogStub = sandbox.stub(console, "error");
      sandbox.stub(localizeUtils, "localize").callsFake((key: string) => {
        if (key === "teamstoolkit.chatParticipants.officeAddIn.create.failToCreate")
          return "Fail to Create";
        else return "Current Workspace";
      });
      await handler.chatCreateOfficeProjectCommandHandler("fakeFolder");

      chai.expect(showQuickPickStub.calledOnce).to.equal(true);
      chai.expect(showOpenDialogStub.called).to.equal(false);
      chai.expect(fsCopyStub.calledOnce).to.equal(true);
      chai.expect(consoleLogStub.args[0][0]).to.equal("Error copying files:");
      chai.expect(consoleLogStub.args[0][1]).to.deep.equal(copyError);
      chai.expect(consoleLogStub.calledOnce).to.equal(true);
      chai.expect(showErrorMessageStub.args[0]).to.deep.equal(["Fail to Create"]);
      chai.expect(showErrorMessageStub.calledOnce).to.equal(true);
    });
  });
});
