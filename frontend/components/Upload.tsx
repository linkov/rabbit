import React, { useState } from "react";
import "@fontsource/zcool-qingke-huangyou";
import axios from 'axios';
import {
    Button,
    Card,
    CircularProgress, Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select, useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/system";

export default function UploadPage() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectImageBtnName, setSelectImageBtnName] = React.useState("Select file");
    const [loading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [tileSize, setTileSize] = React.useState(64);
    const [outputSize, setOutputSize] = React.useState(256);
    let [imageUrl, setImageUrl] = useState(null);

    const trimmedString = (string, length) => {
        return string.length > length ?
            string.substring(0, length) + '...' :
            string;
    };
    const fileUpload = (file) => {

        setLoading(true)
        const url = "http://" + window.location.hostname + ":3001/upload4?tile=" + tileSize + "&output=" + outputSize;
        const formData = new FormData();
        formData.append('sampleFile',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axios.post(url, formData,config).then( response => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
            setImageUrl(response.data.path);
            setLoading(false);
        });
    }

    const handleChangeTileSize = (event) => {
        setTileSize(event.target.value);
    };

    const handleChangeOutputSize = (event) => {
        setOutputSize(event.target.value);
    };

    let handleFileChange = async event => {
        if (event.target.files[0] === undefined) {
            return
        }
        let file = event.target.files[0];
        let fileName = trimmedString(file.name, 8);
        setSelectImageBtnName(fileName);
        setSelectedFile(file);
    };

    let handleGenerate = () => {

        fileUpload(selectedFile);
    }


    // @ts-ignore
    return (

        <div>
            <Grid direction={ matches ? 'column' : 'row'} spacing={5} container justifyContent={'space-around'} alignItems={'center'}>
                <Grid sx={{paddingLeft: '0 !important', display: 'grid', justifyContent: 'center'}} item xs={3}>
                    <FormControl required sx={{ m: matches ? 4 : 10, minWidth: 120 }}>
                        <InputLabel style={{fontFamily:'ZCOOL QingKe HuangYou'}} id="demo-simple-select-required-label">Tile Size</InputLabel>
                        <Select
                            style={{fontFamily:'ZCOOL QingKe HuangYou'}}
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={tileSize}
                            label="Tile Size *"
                            onChange={handleChangeTileSize}
                        >

                            <MenuItem value={64}>64</MenuItem>
                            <MenuItem value={90}>90</MenuItem>
                            <MenuItem value={120}>120</MenuItem>
                            <MenuItem value={132}>132</MenuItem>
                            <MenuItem value={164}>164</MenuItem>
                            <MenuItem value={220}>220</MenuItem>
                            <MenuItem value={256}>256</MenuItem>
                        </Select>
                        <FormHelperText style={{fontFamily:'ZCOOL QingKe HuangYou'}}>Required</FormHelperText>
                    </FormControl>
                    <FormControl required sx={{ m: matches ? 4 : 10, minWidth: 120 }}>
                        <InputLabel style={{fontFamily:'ZCOOL QingKe HuangYou'}} id="demo-simple-select-required-label">Output Size</InputLabel>
                        <Select
                            style={{fontFamily:'ZCOOL QingKe HuangYou'}}
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={outputSize}
                            label="Output Size *"
                            onChange={handleChangeOutputSize}
                        >
                            <MenuItem value={256}>256</MenuItem>
                            <MenuItem value={512}>512</MenuItem>
                            <MenuItem value={1024}>1024</MenuItem>
                            <MenuItem value={2048}>2048</MenuItem>
                        </Select>
                        <FormHelperText style={{fontFamily:'ZCOOL QingKe HuangYou'}}>Required</FormHelperText>
                    </FormControl>

                    <FormControl required sx={{ m: matches ? 4 : 10, minWidth: 120}}>

                        <label htmlFor="contained-button-file">
                            <input style={{display: 'none'}} onChange={handleFileChange}  accept="image/*" id="contained-button-file" type="file" />
                            <Button style={{
                                textAlign: 'center',
                                fontFamily:'ZCOOL QingKe HuangYou',
                                backgroundColor: 'black',
                                whiteSpace: 'nowrap',
                                maxWidth: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }} variant="contained" component="span">
                                {selectImageBtnName}
                            </Button>
                        </label>
                    </FormControl>

                </Grid>
                <Divider hidden={matches} orientation="vertical" flexItem sx={{marginTop: '100px'}} />
                <Grid item xs={3} sx={{paddingLeft: '0 !important', display: 'grid', justifyContent: 'center'}}>

                    <Button color={'error'} style={{fontFamily:'ZCOOL QingKe HuangYou'}} disabled={selectedFile === null || loading} onClick={handleGenerate} variant="contained" component="span">
                        Generate
                    </Button>
                </Grid>
                <Divider hidden={matches} orientation="vertical" flexItem  sx={{marginTop: '100px'}}  />
                <Grid item xs={3} sx={{paddingLeft: '0 !important', display: 'grid', justifyContent: 'center'}}>
                    <Card style={{minHeight: 300, minWidth: 300, position:'relative'}}>
                        {loading && <CircularProgress style={{width: 20, height: 20, position: 'absolute', left:'45%', top:'50%'}} />}
                        {!loading && imageUrl && <img style={{objectFit: 'fill', width: '100%', height: '100%', overflow: 'hidden'}} src={imageUrl}  alt={''}/>}
                    </Card>

                </Grid>
            </Grid>
        </div>
    );
}