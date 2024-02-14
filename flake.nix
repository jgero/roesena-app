{
  # description = "";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    templ = {
      url = "github:a-h/templ";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, templ, treefmt-nix }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      treefmtEval = treefmt-nix.lib.evalModule pkgs ./treefmt.nix;
      templ-bin = templ.packages.${system}.templ;
    in
    {
      formatter.${system} = treefmtEval.config.build.wrapper;
      checks.${system}.formatter = treefmtEval.config.build.check self;
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          go
          gopls
          templ-bin
        ];
      };
      packages.${system}.default = pkgs.buildGoModule {
        pname = "roesena-app";
        version = "0.1";
        # vendorHash = nixpkgs.lib.fakeHash;
        vendorHash = "sha256-FeGap2zXQCIFG894mUOHMDVLR34B84qfXZEGAF4ayjw=";
        src = ./.;
        nativeBuildInputs = [ templ-bin ];
        preBuild = ''
          templ generate hello.templ
        '';
      };
    };
}
