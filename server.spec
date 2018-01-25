# -*- mode: python -*-

block_cipher = None


a = Analysis(['server.py'],
             pathex=['/Users/phillipmalboeuf/Desktop/faces'],
             binaries=[],
             datas=[('Gruntfile.js', '.'), ('package.json', '.'), ('node_modules', 'node_modules')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='server',
          debug=False,
          strip=False,
          upx=True,
          console=False )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='server')
app = BUNDLE(coll,
             name='server.app',
             icon=None,
             bundle_identifier=None)
