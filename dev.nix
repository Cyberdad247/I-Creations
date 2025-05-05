let
  pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  buildInputs = [
    pkgs.python312
    pkgs.python312Packages.pip
    pkgs.sudo
  ];
  shellHook = ''
    export PYTHONPATH=$PWD:$PYTHONPATH
  '';
}
