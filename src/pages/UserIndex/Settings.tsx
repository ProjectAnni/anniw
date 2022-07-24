import React from "react";
import { Grid, FormControl, InputLabel, FormHelperText, Select, MenuItem } from "@mui/material";
import useLocalStorageValue from "@/hooks/useLocalStorageValue";

const Settings: React.FC = () => {
    const [quality, setQuality] = useLocalStorageValue("player.quality", "lossless");
    return (
        <Grid container justifyContent="flex-start">
            <Grid item>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 360 }}>
                    <InputLabel id="quality-select-label">音质偏好</InputLabel>
                    <Select
                        labelId="quality-select-label"
                        id="quality-select"
                        value={quality}
                        label="音质偏好"
                        
                        onChange={(e) => setQuality(e.target.value as string)}
                    >
                        <MenuItem value="low">高</MenuItem>
                        <MenuItem value="medium">很高</MenuItem>
                        <MenuItem value="high">极高</MenuItem>
                        <MenuItem value="lossless">Hi-Res</MenuItem>
                    </Select>
                    <FormHelperText>客户端传递的参数仅为客户端偏好，对音频仓库仅有指导意义，不代表实际结果</FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default Settings;
